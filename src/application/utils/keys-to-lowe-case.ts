export const keysToLowerCase = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj as T; // If it's not an object, return the original value
  }

  if (Array.isArray(obj)) {
    // If it's an array, map over all elements and apply the function to each of them
    return obj.map(keysToLowerCase) as unknown as T;
  }

  // If it's an object, iterate over the keys and apply the function recursively
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = key.toLowerCase(); // Convert the key to lowercase
    const value = obj[key as keyof typeof obj];
    acc[newKey] = typeof value === 'object' ? keysToLowerCase(value) : value; // Apply the function recursively if the value is also an object
    return acc;
  }, {} as T);
};
