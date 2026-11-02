import type { StaticImageData } from "next/image";

import rabbi2 from "@/public/images/developers/rabbi.jpg";
import bitto2 from "@/public/images/developers/bitto2.jpg";
import nilay from "@/public/images/developers/nilay.jpg";
import amio from "@/public/images/developers/amio.jpg";
import sujoy from "@/public/images/developers/sujoy.jpg";
import miraj from "@/public/images/developers/miraj.jpg";
import ahnaf from "@/public/images/developers/ahnaf.jpg";
import shadman from "@/public/images/developers/shadman.jpg";
import ratul from "@/public/images/developers/ratul2.jpeg";
import seam from "@/public/images/developers/seam.jpg";
import arnob from "@/public/images/developers/arnob.jpg";


export interface Developer {
  name: string;
  role: string;
  location?: string;
  image?: StaticImageData;
  roll?: string;
  github?: string;
  linkedin?: string;
  facebook?: string;
  mail?: string;
}

export const developers: Developer[] = [
  {
    name: "Md. Fazle Rabbi",
    role: "Frontend & Backend, Code Reviewer",
    location: "Khulna, Bangladesh",
    image: rabbi2,
    mail: "mmrabbi625442@gmail.com",
    roll: "2403172",
    github: "https://github.com/rabbi6272",
    linkedin: "https://www.linkedin.com/in/rabbi6272/",
    facebook: "https://www.facebook.com/frabbi6272",
  },
  {
    name: "Bitto Saha",
    role: "Frontend & Backend, Code Reviewer",
    image: bitto2,
    roll: "2403142",
    location: "Bogura, Bangladesh",
    github: "https://github.com/idcnys/",
    linkedin: "https://www.linkedin.com/in/bittosaha/",
    facebook: "https://www.facebook.com/biiitto",
  },
  {
    name: "Morchhalin Alam Amio",
    role: "Security & Tester",
    image: amio,
    roll: "2403154",
    location: "Kurigram, Bangladesh",
    github: "https://github.com/Amio75",
    linkedin: "https://www.linkedin.com/in/morchhalin-alam-amio-bb35a8360",
    facebook: "https://www.facebook.com/share/1FP1VwSFvd/",
  },
  {
    name: "Sujoy Roy",
    role: "Resource Management",
    image: sujoy,
    roll: "2403099",
    mail: "sujoy2005roy@gmail.com",
    location: "Barishal, Bangladesh",
    github: "https://github.com/SujoyRoy",
    linkedin: "https://www.linkedin.com/in/sujoy-roy-855738216",
    facebook: "https://www.facebook.com/share/1JopP1ruvs/",
  },
  // {
  //   name: "Eftekhar Hasnat Rahi",
  //   role: "Media Team",
  //   image: rahi,
  //   location: "Dinajpur, Bangladesh",
  //   github: "https://github.com/RAHI-568",
  //   linkedin: "#",
  //   facebook: "https://www.facebook.com/eftekharhasnat.rahi.568",
  // },
  {
    name: "Nilay Paul Partha",
    role: "Code Reviewer & Tester",
    image: nilay,
    roll: "2403160",
    location: "Cox's Bazar, Bangladesh",
    github: "https://github.com/nilaypaulpartha",
    linkedin: "https://bd.linkedin.com/in/nilay-paul-partho-064654259",
    facebook: "https://www.facebook.com/nilay.paul.2006",
  },
  {
    name: "Mirajul Islam",
    role: "Code Reviewer & Tester",
    image: miraj,
    roll: "2403147",
    location: "Kushtia, Bangladesh",
    github: "#",
    linkedin: "https://www.linkedin.com/in/md-mirajul-islam-98071624b/",
    facebook: "https://www.facebook.com/mirajul.islam.470234/",
  },
  {
    name: "Tasaouf Ahnaf",
    role: "Resource Management",
    image: ahnaf,
    roll: "2403140",
    mail: "tasaouf.ahnaf@gmail.com",
    location: "Dhaka, Bangladesh",
    github: "https://github.com/Tasaouf-Ahnaf",
    linkedin: "https://www.linkedin.com/in/tasaoufahnaf/",
    facebook: "https://www.facebook.com/tasaouf.ahnaf",
  },
  {
    name: "Shadman Ahmed",
    role: "Code Reviewer & Tester",
    image: shadman,
    roll: "2403127",
    location: "Bogura, Bangladesh",
    github: "https://github.com/Shadman234-sa",
    linkedin: "https://www.linkedin.com/in/shadman-ahmed-04688b210",
    facebook: "https://www.facebook.com/share/1BrJK4hiuJ/",
  },
  {
    name: "Arnob Benedict Tudu",
    role: "Code Reviewer & Tester",
    image: arnob,
    roll: "2403155",
    mail: "arnobbenedicttudu@gmail.com",
    location: "Rajshahi, Bangladesh",
    github: "https://github.com/Arnob001607",
    linkedin: "https://www.linkedin.com/in/arnob-b-tudu-616045360",
    facebook: "https://www.facebook.com/share/1aG3Qw34AL/",
  },
  // {
  //   name: "A Q M Mahadi Haque",
  //   role: "Resource Management",
  //   image: aqm,
  //   location: "Dhaka, Bangladesh",
  //   github: "#",
  //   linkedin: "#",
  //   facebook: "https://www.facebook.com/rehanhaque2k5",
  // },
  {
    name: "Arefin Noused Ratul",
    role: "Resource Management",
    image: ratul,
    roll: "2403149",
    mail: "anratul05@gmail.com",
    location: "Dhaka, Bangladesh",
    github: "https://github.com/Arefin-Ratul",
    linkedin: "https://www.linkedin.com/in/arefin-noused-ratul-622692366",
    facebook: "https://www.facebook.com/arefin.ratul.18",
  },
  {
    name: "Shahriar Seam",
    role: "Code Reviewer & Tester",
    image: seam,
    roll: "2403150",
    mail: "shahriar.seam@gmail.com",
    location: "Dhaka, Bangladesh",
    github: "https://github.com/salterynn",
    linkedin: "#",
    facebook: "https://www.facebook.com/shahriar.abdullah.1422",
  },
  // {
  //   name: "Shariar Mustaq",
  //   role: "Resource Management",
  //   image: mustaq,
  //   location: "Rajshahi, Bangladesh",
  //   github: "#",
  //   linkedin: "#",
  //   facebook: "https://www.facebook.com/shahriarmustaqq",
  // },
];
