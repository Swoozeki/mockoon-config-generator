/**
 * Validates that all required UUIDs are provided in the configuration objects
 */

/**
 * Validates that all required UUIDs are provided in the given object
 * @param obj The object to validate
 * @param path The path to the object (for error messages)
 */
/**
 * Validates that the UUID is in the correct format
 * @param uuid The UUID to validate
 * @returns True if the UUID is valid, false otherwise
 */
export function isValidUUIDFormat(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validates that all required UUIDs are provided in the given object
 * and that they are in the correct format
 * @param obj The object to validate
 * @param path The path to the object (for error messages)
 */
export function validateUUID(obj: any, path: string): void {
  if (!obj) {
    return;
  }

  if (typeof obj === "object" && "uuid" in obj) {
    // Check if UUID is missing
    if (!obj.uuid) {
      throw new Error(`Missing UUID in ${path}`);
    }

    // Check if UUID format is invalid
    if (!isValidUUIDFormat(obj.uuid)) {
      throw new Error(`Invalid UUID format in ${path}: ${obj.uuid}`);
    }
  }

  // Validate UUIDs in nested objects
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      validateUUID(item, `${path}[${index}]`);
    });
  } else if (typeof obj === "object" && obj !== null) {
    for (const key in obj) {
      if (
        key === "responses" ||
        key === "children" ||
        key === "data" ||
        key === "routes" ||
        key === "folders"
      ) {
        validateUUID(obj[key], `${path}.${key}`);
      }
    }
  }
}
