// User authentication utilities

const USER_ID_KEY = 'eco_bonus_user_id';

/**
 * Generates a random user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Gets the user ID from localStorage, or creates a new one if it doesn't exist
 */
export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('Generated new user ID:', userId);
  }
  
  return userId;
}

/**
 * Sets a new user ID
 */
export function setUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

/**
 * Clears the user ID (logout)
 */
export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}

