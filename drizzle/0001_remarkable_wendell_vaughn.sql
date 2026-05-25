CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_name` varchar(255) NOT NULL,
	`patient_email` varchar(320) NOT NULL,
	`patient_phone` varchar(20) NOT NULL,
	`service_id` int,
	`appointment_date` timestamp,
	`appointment_time` varchar(10),
	`message_en` text,
	`message_hi` text,
	`status` enum('pending','confirmed','cancelled','completed') DEFAULT 'pending',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title_en` varchar(255) NOT NULL,
	`title_hi` varchar(255) NOT NULL,
	`slug_en` varchar(255) NOT NULL,
	`slug_hi` varchar(255) NOT NULL,
	`content_en` text,
	`content_hi` text,
	`excerpt_en` text,
	`excerpt_hi` text,
	`author_name` varchar(255),
	`featured_image_url` varchar(500),
	`is_published` boolean DEFAULT false,
	`published_at` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_en_unique` UNIQUE(`slug_en`),
	CONSTRAINT `blog_posts_slug_hi_unique` UNIQUE(`slug_hi`)
);
--> statement-breakpoint
CREATE TABLE `clinic_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_en` varchar(255) NOT NULL,
	`name_hi` varchar(255) NOT NULL,
	`description_en` text,
	`description_hi` text,
	`phone` varchar(20),
	`email` varchar(320),
	`address` text,
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`opening_hours_en` text,
	`opening_hours_hi` text,
	`logo_url` varchar(500),
	`banner_image_url` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clinic_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question_en` varchar(500) NOT NULL,
	`question_hi` varchar(500) NOT NULL,
	`answer_en` text,
	`answer_hi` text,
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title_en` varchar(255),
	`title_hi` varchar(255),
	`image_url` varchar(500) NOT NULL,
	`thumbnail_url` varchar(500),
	`category_en` varchar(100),
	`category_hi` varchar(100),
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title_en` varchar(255) NOT NULL,
	`title_hi` varchar(255) NOT NULL,
	`description_en` text,
	`description_hi` text,
	`duration_minutes` int,
	`price_inr` decimal(10,2),
	`icon_url` varchar(500),
	`image_url` varchar(500),
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name_en` varchar(255) NOT NULL,
	`name_hi` varchar(255) NOT NULL,
	`title_en` varchar(255),
	`title_hi` varchar(255),
	`bio_en` text,
	`bio_hi` text,
	`image_url` varchar(500),
	`order` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patient_name_en` varchar(255) NOT NULL,
	`patient_name_hi` varchar(255) NOT NULL,
	`testimonial_en` text,
	`testimonial_hi` text,
	`rating` int DEFAULT 5,
	`image_url` varchar(500),
	`is_approved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
