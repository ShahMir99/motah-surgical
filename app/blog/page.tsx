"use client";

import { motion } from "framer-motion";
import BlogPost from "@/components/shared/BlogPost";

import featuredBlogImage1 from "@/assets/blogs/featured-blog.jpg";
import BlogImage1 from "@/assets/blogs/blog1.jpg";
import BlogImage2 from "@/assets/blogs/blog2.jpg";
import BlogImage3 from "@/assets/blogs/blog3.jpg";

const blogsData = [
  {
    id: 1,
    title: "More Than Repair: The Life-Saving Imperative of Microsurgery",
    category: "News exhibitions",
    date: "2025-02-01",
    blogImage: BlogImage1.src,
  },
  {
    id: 2,
    title:
      "Engineered for Extremes: The Unseen Material Science Behind High-Precision Microsurgical Instruments",
    category: "News exhibitions",
    date: "2025-02-01",
    blogImage: BlogImage2.src,
  },
  {
    id: 3,
    title:
      "Microsurgery Industry Trends 📈 The Business of Precision: Key Trends Driving the Microsurgery Market to $4.3 Billion by 2032",
    category: "News exhibitions",
    date: "2025-02-01",
    blogImage: BlogImage3.src,
  },
];

export default function LiposuctionCategoryPage() {
  return (
    <main className="bg-white text-[#4A5560]">
      {/* HERO */}
      <div className="grid grid-cols-1 md:grid-cols-[48%_52%] max-w-[1250px] mx-auto min-h-[620px]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#18B27F] text-white flex flex-col justify-center gap-8 px-7 py-14 md:px-12 md:py-14"
        >
          <span className="text-[23px] font-bold tracking-[2px]">BLOGS</span>

          <h1 className="font-light text-[28px]  md:text-[55px] leading-[1.35] pt-14 pb-20">
            Insights, Inspiration, and Expertise: 
            <span className="text-[45px] font-bold tracking-[2px]">
               Dive into our Inspiring Blog
            </span>
          </h1>
        </motion.div>

        <div className="order-first flex-col md:order-last gap-5 flex pl-16 justify-center overflow-hidden min-h-[320px]">
          <h1 className="font-bold text-[28px] md:text-[42px] text-primary leading-[1.25]">
            Featured Blog
          </h1>

          <BlogPost
            id={1}
            title="More Than Repair: The Life-Saving Imperative of Microsurgery"
            category="News exhibitions"
            date="October 24, 2023"
            blogImage={featuredBlogImage1.src}
          />
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 pb-28">
        {/* INTRO */}
        <section className="pt-14">
          <h2 className="text-[#18B27F] font-bold text-[42px] mb-5">Blogs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
            {blogsData.map((blog) => (
              <BlogPost
                key={blog.id}
                title={blog.title}
                category={blog.category}
                blogImage={blog.blogImage}
                date={blog.date}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
