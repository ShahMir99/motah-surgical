"use client"
import { Button } from "../ui/button";

interface BlogData {
  id?: number;
  title: string;
  category: string;
  date?: string;
  blogImage: string;
}


const BlogPost = ({ title, category, blogImage, date}: BlogData) => {
  return (
    <div
      className="bg-white overflow-hidden group"
    >
      {/* Blog Image */}
      <div className="relative overflow-hidden">
        <img
          src={blogImage}
          alt={title}
          className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />
      </div>

      {/* Blog Content */}
      <div className="p-5 flex flex-col gap-2">
        {/* <p className="text-xs uppercase tracking-wide text-[#18b27f] font-semibold">
          {category}
        </p> */}
        <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#18b27f] line-clamp-2 transition-colors duration-300">
          {title}
        </h2>
        <p className="text-sm text-gray-500">{date}</p>
        <Button
          className="self-start btn-primary mt-2 px-8 cursor-pointer"
        >
          Read More →
        </Button>
      </div>
    </div>
  );
};

export default BlogPost;
