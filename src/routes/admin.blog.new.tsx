import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { PostEditor } from "@/components/blog/PostEditor";

export const Route = createFileRoute("/admin/blog/new")({
  head: () => ({ meta: [{ title: "New Post · Admin" }, { name: "robots", content: "noindex" }] }),
  component: NewPostPage,
});

function NewPostPage() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setOk(true);
    });
  }, [navigate]);
  if (!ok) return null;
  return <PostEditor initialPost={null} />;
}
