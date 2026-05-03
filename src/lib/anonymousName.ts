import { supabase } from "@/integrations/supabase/client";

const ANIMALS = [
  "Panda", "Fox", "Turtle", "Otter", "Falcon", "Lion", "Owl", "Whale",
  "Tiger", "Eagle", "Hare", "Heron", "Lynx", "Moose", "Quail", "Raven",
  "Seal", "Wolf", "Yak", "Koala", "Badger", "Crane", "Dolphin", "Hawk",
  "Lemur", "Mantis", "Newt", "Penguin", "Stag", "Wren", "Bison", "Cheetah",
  "Cobra", "Coyote", "Dingo", "Falcon", "Gecko", "Hedgehog", "Ibis", "Jaguar",
  "Kestrel", "Leopard", "Mongoose", "Narwhal", "Ocelot", "Puma", "Rhino",
  "Salmon", "Toucan", "Urchin", "Viper", "Walrus", "Zebra", "Antelope",
  "Beaver", "Caribou", "Doe", "Elk", "Ferret", "Gibbon", "Hyena", "Impala",
  "Jackal", "Kingfisher", "Llama", "Magpie", "Nightingale", "Oryx", "Pelican",
  "Robin", "Sparrow", "Tapir", "Vulture", "Wolverine",
];

function randomAnimal(): string {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

export function generateAnonName(): string {
  return randomAnimal();
}

const TOKEN_KEY = (slug: string) => `cocreate:token:${slug}`;
const NAME_KEY = (slug: string) => `cocreate:name:${slug}`;

/**
 * Generate a unique single-word display name for the given session.
 * Falls back to suffixing with a number when the chosen word is taken.
 */
export async function generateUniqueAnonName(sessionId: string): Promise<string> {
  const { data } = await supabase
    .from("cocreation_participants")
    .select("display_name")
    .eq("session_id", sessionId);
  const taken = new Set<string>(((data as any[]) || []).map((r) => r.display_name));

  // Try 20 fresh picks before falling back to numeric suffixes
  for (let i = 0; i < 20; i++) {
    const candidate = randomAnimal();
    if (!taken.has(candidate)) return candidate;
  }
  const base = randomAnimal();
  let n = 2;
  while (taken.has(`${base}${n}`)) n++;
  return `${base}${n}`;
}

export function getCachedAnonIdentity(slug: string): { token: string; displayName: string | null } {
  let token = localStorage.getItem(TOKEN_KEY(slug));
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(TOKEN_KEY(slug), token);
  }
  const displayName = localStorage.getItem(NAME_KEY(slug));
  return { token, displayName };
}

export function cacheAnonName(slug: string, displayName: string) {
  localStorage.setItem(NAME_KEY(slug), displayName);
}

/** Legacy helper kept for any existing callers — prefer the unique async variant. */
export function getOrCreateAnonIdentity(slug: string): { token: string; displayName: string } {
  const { token, displayName } = getCachedAnonIdentity(slug);
  const name = displayName || generateAnonName();
  if (!displayName) cacheAnonName(slug, name);
  return { token, displayName: name };
}
