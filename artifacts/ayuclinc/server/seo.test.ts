import { describe, it, expect } from "vitest";
import { generateSitemap } from "./sitemap";

describe("SEO - Sitemap Generation", () => {
  it("should generate valid XML sitemap", () => {
    const baseUrl = "https://example.com";
    const sitemap = generateSitemap(baseUrl);

    // Check XML declaration
    expect(sitemap).toContain('<?xml version="1.0" encoding="UTF-8"?>');

    // Check urlset tag
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(sitemap).toContain("</urlset>");

    // Check all pages are included
    expect(sitemap).toContain("https://example.com/");
    expect(sitemap).toContain("https://example.com/about");
    expect(sitemap).toContain("https://example.com/services");
    expect(sitemap).toContain("https://example.com/gallery");
    expect(sitemap).toContain("https://example.com/blog");
    expect(sitemap).toContain("https://example.com/appointment");
    expect(sitemap).toContain("https://example.com/contact");
  });

  it("should include proper priority values", () => {
    const baseUrl = "https://example.com";
    const sitemap = generateSitemap(baseUrl);

    // Home page should have highest priority
    expect(sitemap).toContain("<priority>1.0</priority>");

    // Services and appointment should have high priority
    expect(sitemap).toMatch(/<priority>0\.9<\/priority>/);
  });

  it("should include changefreq for each page", () => {
    const baseUrl = "https://example.com";
    const sitemap = generateSitemap(baseUrl);

    expect(sitemap).toContain("<changefreq>weekly</changefreq>");
    expect(sitemap).toContain("<changefreq>monthly</changefreq>");
    expect(sitemap).toContain("<changefreq>daily</changefreq>");
  });

  it("should include lastmod date", () => {
    const baseUrl = "https://example.com";
    const sitemap = generateSitemap(baseUrl);

    // Should have today's date in ISO format
    const today = new Date().toISOString().split("T")[0];
    expect(sitemap).toContain(`<lastmod>${today}</lastmod>`);
  });

  it("should handle different base URLs", () => {
    const sitemap1 = generateSitemap("https://clinic.com");
    const sitemap2 = generateSitemap("https://ayurveda.org");

    expect(sitemap1).toContain("https://clinic.com/");
    expect(sitemap2).toContain("https://ayurveda.org/");
  });
});
