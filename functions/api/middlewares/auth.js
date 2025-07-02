// Authentication middleware for API endpoints
export async function validateApiKey(request, env) {
  const apiKey = request.headers.get('X-API-Key');
  
  if (!apiKey) {
    return {
      valid: false,
      error: 'API key required',
      status: 401
    };
  }
  
  // Validate API key format (basic check)
  if (!apiKey.startsWith('apk_') || apiKey.length < 32) {
    return {
      valid: false,
      error: 'Invalid API key format',
      status: 401
    };
  }
  
  try {
    // Check API key in database
    const keyRecord = await env.DB.prepare(
      'SELECT * FROM api_keys WHERE key_hash = ? AND is_active = true'
    ).bind(hashApiKey(apiKey)).first();
    
    if (!keyRecord) {
      return {
        valid: false,
        error: 'Invalid API key',
        status: 401
      };
    }
    
    // Check if key is expired
    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
      return {
        valid: false,
        error: 'API key expired',
        status: 401
      };
    }
    
    // Update last used timestamp
    await env.DB.prepare(
      'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP, usage_count = usage_count + 1 WHERE id = ?'
    ).bind(keyRecord.id).run();
    
    return {
      valid: true,
      userId: keyRecord.user_id,
      keyId: keyRecord.id
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return {
      valid: false,
      error: 'Authentication error',
      status: 500
    };
  }
}

// Simple hash function for API keys (use crypto in production)
function hashApiKey(apiKey) {
  // In production, use proper crypto hashing
  return btoa(apiKey);
}

// Rate limiting check
export async function checkRateLimit(request, env, userId) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate_limit:${userId}:${ip}`;
  
  try {
    const current = await env.CACHE.get(key);
    const count = current ? parseInt(current) : 0;
    
    // 100 requests per minute per user/IP combination
    if (count >= 100) {
      return {
        allowed: false,
        error: 'Rate limit exceeded',
        retryAfter: 60
      };
    }
    
    // Increment counter with 60 second expiration
    await env.CACHE.put(key, (count + 1).toString(), { expirationTtl: 60 });
    
    return {
      allowed: true,
      remaining: 100 - count - 1
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request if rate limiting fails
    return { allowed: true };
  }
}