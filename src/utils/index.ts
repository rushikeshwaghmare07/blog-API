export const genUsername = (): string => {
  const usernamePrefix = "user-";
  const randomChars = Math.random().toString(36).slice(2);

  const username = usernamePrefix + randomChars;

  return username;
};

// Generate a random slug from a title (e.g.: my-title-abc123)
export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z1-9]\s-/g, "")
    .replace(/\+/g, "-")
    .replace(/-+/g, "-");

  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug}-${randomChars}`;

  return uniqueSlug;
};
