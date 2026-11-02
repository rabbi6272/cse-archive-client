// Alumni form validation, run on the server before anything is written (it's the trust boundary).

export type AlumnusInput = {
  name: string;
  dept: string;
  series: string;
  optional: string;
  address: string;
  country: string;
  badges: string[];
  linkedinurl: string;
  longitude: string;
  latitude: string;
};

export const DEPARTMENTS = ["CSE", "EEE", "ME", "CE", "IPE", "URP", "ARCH", "ChE", "BECM"];

// Returns the first problem, or null. Same rules as the old admin page, plus department/badge/URL checks.
export function validateAlumnus(f: AlumnusInput, allowedBadges: string[]): string | null {
  if (!f.name.trim()) return "Name is required.";
  if (!f.series.trim()) return "Graduation series/year is required.";
  if (!f.address.trim()) return "Address is required.";
  if (!f.country.trim()) return "Country is required.";
  if (!DEPARTMENTS.includes(f.dept)) return "Pick a department from the list.";
  if (f.badges.some((b) => !allowedBadges.includes(b))) return "Unknown badge.";
  if (f.linkedinurl && !/^https:\/\/([a-z]+\.)?linkedin\.com\//i.test(f.linkedinurl))
    return "LinkedIn URL must start with https://linkedin.com/ or https://www.linkedin.com/.";
  const lng = Number(f.longitude);
  const lat = Number(f.latitude);
  if (!f.longitude.trim() || !f.latitude.trim() || Number.isNaN(lng) || Number.isNaN(lat))
    return "Longitude and latitude must both be numbers.";
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90)
    return "Coordinates out of range (longitude −180 to 180, latitude −90 to 90).";
  return null;
}
