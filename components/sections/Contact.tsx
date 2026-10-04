"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  ArrowUpRight,
  Send,
} from "lucide-react";
import { Github, Linkedin, WhatsappLogo, GmailLogo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/portfolio-defaults";
import { SectionTitle } from "@/components/ui/section-title";


export default function Contact({
  initialProfile,
}: {
  initialProfile?: ProfileData;
}) {
  const [copied, setCopied] = useState(false);
  const profile = initialProfile || DEFAULT_PROFILE;
  const emailAddress = profile.email || DEFAULT_PROFILE.email || "rakapradana.work@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const githubHref = profile.github_url || DEFAULT_PROFILE.github_url;
  const linkedinHref = profile.linkedin_url || DEFAULT_PROFILE.linkedin_url;
  const whatsappHref = profile.whatsapp_url || DEFAULT_PROFILE.whatsapp_url;

  const socialLinks = [
    {
      label: "GitHub",
      handle: githubHref.replace(/^https?:\/\//, ""),
      href: githubHref,
      icon: Github,
      detail: "View open-source repositories & commits",
    },
    {
      label: "LinkedIn",
      handle: linkedinHref.replace(/^https?:\/\//, ""),
      href: linkedinHref,
      icon: Linkedin,
      detail: "Professional career updates & endorsements",
    },
    {
      label: "WhatsApp",
      handle: profile.phone || "+62 851-5600-0636",
      href: whatsappHref,
      icon: WhatsappLogo,
      detail: "Instant messaging for project inquiries",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge
            variant="outline"
            className="mb-3 px-3.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#8C5747] dark:text-[#E7C3B5] border-[#8C5747]/20 dark:border-[#E7C3B5]/30 bg-card shadow-2xs"
          >
            Initiate Contact
          </Badge>
          <SectionTitle>
            Let&apos;s Build Something Exceptional
          </SectionTitle>
          <p className="text-muted-foreground text-sm max-w-md mt-3 font-normal">
            Whether you have an engineering opening, a scalable software challenge, or a contract project, my inbox is always open.
          </p>
        </div>

        {/* Minimalist Contact Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Email Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col"
          >
            <Card className="h-full flex flex-col justify-between p-8 border border-border bg-card relative overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="p-3 rounded-2xl bg-secondary border border-border w-fit mb-6 shadow-2xs">
                  <GmailLogo className="w-6 h-6" />
                </div>

                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 font-bold">
                  Direct Email Dispatch
                </p>
                <h3 className="text-xl sm:text-3xl font-extrabold text-foreground mb-3 break-all">
                  {emailAddress}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md font-normal">
                  Expect a prompt response within 24 hours. Feel free to copy my address directly or launch your default mail client.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-6 sm:pt-8 mt-6 border-t border-border ">
                <Button
                  onClick={handleCopyEmail}
                  data-track-event="contact_click"
                  data-track-target="Copy Email"
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2 w-full sm:w-auto justify-center cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Email Address
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border border-border dark:border-[#3E2E28] bg-secondary text-foreground dark:text-[#F6ECE7] hover:bg-secondary/80 gap-2 w-full sm:w-auto justify-center font-semibold"
                >
                  <a
                    href={`mailto:${emailAddress}`}
                    data-track-event="contact_click"
                    data-track-target="Direct Email App"
                  >
                    Open Mail App
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Social Channels List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-track-event="contact_click"
                  data-track-target={item.label}
                  className="group rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:border-ring  hover:shadow-sm transition-all duration-200 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-secondary border border-border group-hover:border-ring dark:group-hover:border-border transition-colors shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-muted-foreground transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.handle}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground group-hover:text-foreground dark:group-hover:text-foreground group-hover:border-ring dark:group-hover:border-border transition-colors shadow-2xs">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
