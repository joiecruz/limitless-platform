const ADJECTIVES = [
  "Curious", "Bright", "Calm", "Bold", "Swift", "Quiet", "Witty", "Kind",
  "Eager", "Gentle", "Clever", "Sunny", "Brave", "Lively", "Mellow", "Nimble",
  "Cheerful", "Daring", "Fierce", "Humble", "Jolly", "Keen", "Patient", "Sharp",
  "Steady", "Wise", "Zesty", "Vivid", "Playful", "Earnest",
];

const ANIMALS = [
  "Panda", "Fox", "Turtle", "Otter", "Falcon", "Lion", "Owl", "Whale",
  "Tiger", "Eagle", "Hare", "Heron", "Lynx", "Moose", "Quail", "Raven",
  "Seal", "Wolf", "Yak", "Koala", "Badger", "Crane", "Dolphin", "Hawk",
  "Lemur", "Mantis", "Newt", "Penguin", "Stag", "Wren",
];

export function generateAnonName(): string {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  return `${a} ${n}`;
}

const TOKEN_KEY = (slug: string) => `cocreate:token:${slug}`;
const NAME_KEY = (slug: string) => `cocreate:name:${slug}`;

export function getOrCreateAnonIdentity(slug: string): { token: string; displayName: string } {
  let token = localStorage.getItem(TOKEN_KEY(slug));
  let displayName = localStorage.getItem(NAME_KEY(slug));
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY(slug), token);
  }
  if (!displayName) {
    displayName = generateAnonName();
    localStorage.setItem(NAME_KEY(slug), displayName);
  }
  return { token, displayName };
}
