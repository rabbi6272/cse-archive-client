import type { StaticImageData } from "next/image";
import type { CoverLink } from "@/components/cards/CoverCard";
import image0 from "@/public/images/shelf/image00.jpg";
import image1 from "@/public/images/shelf/image002.jpg";
import image2 from "@/public/images/shelf/image02.jpg";
import image3 from "@/public/images/shelf/image03.jpg";
import image4 from "@/public/images/shelf/image04.jpg";
import image5 from "@/public/images/shelf/image05.jpg";
import image6 from "@/public/images/shelf/image06.jpg";
import image7 from "@/public/images/shelf/image07.jpg";

export type ShelfItem = { title: string; image: StaticImageData; links: CoverLink[] };

const youtube: CoverLink = { label: "YouTube" };

export const shelf: ShelfItem[] = [
  { title: "Physics", image: image0, links: [{ label: "Drive" }, youtube] },
  { title: "Maths", image: image2, links: [{ label: "Drive", href: "/drive/15uaZEhr0Om7cOT_xHnL0d-8HFmyGK6Js" }, youtube] },
  { title: "Chemistry", image: image1, links: [{ label: "Drive", href: "/drive/1eV35EzY4CCWv4lu5BWYmAOn3vcV0LWiX" }, youtube] },
  { title: "C programming", image: image3, links: [{ label: "Drive", href: "/drive/1UdOHPrjWU5dx33eO4k6GlbUl2PmQTeeP" }, youtube] },
  { title: "Computer Science", image: image7, links: [{ label: "Drive", href: "/drive/1hf2cSufrcjLbDZ1Oe1VqjKs3SyN-dNXQ" }, youtube] },
  { title: "Computer Hardware", image: image4, links: [{ label: "Drive", href: "/drive/1918v26FB2PrPPCczU_GyUX1VQSlFAHMC" }, youtube] },
  { title: "Competitive Programming", image: image6, links: [{ label: "Drive", href: "/drive/1UfBBUh4mQHwF3RSNe2xuMmiB812yWshW" }, youtube] },
  { title: "English", image: image5, links: [{ label: "Drive", href: "/drive/1l1j8yHlsWJIhJIFXbqyaz-W2Onw8da1O" }, youtube] },
];
