import type {MetadataRoute} from "next";
export default function robots():MetadataRoute.Robots{return{rules:[{userAgent:"*",allow:"/",disallow:["/report","/admin","/api"]}],sitemap:["https://quotes.org.in/sitemap.xml","https://quotes.org.in/image-sitemap.xml"]}}
