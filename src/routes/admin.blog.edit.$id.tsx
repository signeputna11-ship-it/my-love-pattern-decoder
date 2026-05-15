import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { PostEditor } from "@/components/blog/PostEditor";
import { adminGetPost, type BlogPost } from "@/lib/blog.functions";

export const Route = createFileRoute("/admin/blog/edit/$id")({
  head: () => ({ meta: [{ title: "Edit Post · Admin" }, { name: "robots", content: "noindex" }] }),
  component: EditPostPage,
});

function EditPostPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const get = useServerFn(adminGetPost);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      get({ data: { id } })
        .then((r) => setPost(r.post))
        .catch((e) => alert(e?.message))
        .finally(() => setLoading(false));
    });
  }, [id, navigate, get]);

  if (loading) return <div className="p-12 text-center" style={{ color: "#8A8480" }}>Loading...</div>;
  if (!post) return <div className="p-12 text-center" style={{ color: "#8A8480" }}>Post not found.</div>;
  return <PostEditor initialPost={post} />;
}
