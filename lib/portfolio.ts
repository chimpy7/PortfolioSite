import { connectDB } from "./mongodb";
import User from "../models/userschema";
import Experience from "../models/experienceroute";

interface RawExperience {
  _id: string;
  Title: string;
  start: string;
  end: string;
  details: string;
}

export interface PortfolioExperience {
  id: string;
  Title: string;
  start: string;
  end: string;
  details: string;
}

export interface PortfolioProfile {
  name: string;
}

export interface PortfolioData {
  profile: PortfolioProfile;
  experiences: PortfolioExperience[];
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeSlug = (slug: string) =>
  decodeURIComponent(slug)
    .replace(/-/g, " ")
    .trim();

export async function getPortfolioByUsername(
  slug: string
): Promise<PortfolioData | null> {
  await connectDB();

  const normalizedName = normalizeSlug(slug);

  if (!normalizedName) {
    return null;
  }

  const user = await User.findOne({
    name: new RegExp(`^${escapeRegExp(normalizedName)}$`, "i"),
  }).populate({ path: "experience", model: Experience });

  if (!user) {
    return null;
  }

  const experiences: PortfolioExperience[] = Array.isArray(user.experience)
    ? (user.experience as unknown as RawExperience[]).map((exp) => ({
        id: exp._id.toString(),
        Title: exp.Title,
        start: exp.start,
        end: exp.end,
        details: exp.details,
      }))
    : [];

  return {
    profile: { name: user.name },
    experiences,
  };
}

export const slugifyUsername = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
