import type { StaticImageData } from "next/image";
import image0 from "@/public/images/resources/image0.jpg";
import image1 from "@/public/images/resources/image1.jpg";
import image2 from "@/public/images/resources/image2.jpg";
import image3 from "@/public/images/resources/image3.jpg";
import image4 from "@/public/images/resources/image4.jpg";

import type { CoverLink } from "@/components/cards/CoverCard";

export type Resource = {
  title: string;
  description: string;
  image: StaticImageData;
  links: CoverLink[];
};

export const resources: Resource[] = [
  {
    title: "1st Year Resources",
    description:
      "Just entered the matrix? Here's your starter pack: C programming, logic gates, and enough math to question your existence. Escape infinite loops early!",
    image: image0,
    links: [
      { label: "1 - 1", href: "/drive/1l7a6E_dt9Jg4woxOiW8EnzHtRGTo0EbP" },
      { label: "1 - 2", href: "/drive/1ANRGpNCCFHhsQk8MnjHs_cT6Jl4zkcLT" },
    ],
  },
  {
    title: "2nd Year Resources",
    description:
      "You've compiled your basics. Now get ready for bugs that don't show errors! Dive into 'why won't this code run?!' energy.",
    image: image1,
    links: [{ label: "2 - 1", href: "/drive/1zxDdCdFiquVKO86oOLXKxMsSCJalHld_" }, { label: "2 - 2" }],
  },
  {
    title: "3rd Year Resources",
    description:
      "Code is life now. OS deadlocks, Git merge conflicts, and your first real project where 'it works on my machine' is a valid excuse. Enjoy the chaos!",
    image: image2,
    links: [{ label: "3 - 1" }, { label: "3 - 2" }],
  },
  {
    title: "4th Year Resources",
    description:
      "You're almost out! But wait: ML models, thesis panic, final year projects and last-minute internship hunts. Now's the time to pretend you know everything.",
    image: image3,
    links: [{ label: "4 - 1" }, { label: "4 - 2" }],
  },
  {
    title: "Higher Studies & Internship Details",
    description:
      "Want to escape the 9-to-5 matrix? Whether it's GRE stress or internship ghosting, we got the hacks. Also, don't forget to update your LinkedIn.",
    image: image4,
    links: [{ label: "Read more" }],
  },
];
