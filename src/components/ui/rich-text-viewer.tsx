"use client";

import { Extension } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [
    StarterKit.configure({
        orderedList: {
            HTMLAttributes: {
                class: "list-decimal",
            },
        },
        bulletList: {
            HTMLAttributes: {
                class: "list-disc",
            },
        },
        code: {
            HTMLAttributes: {
                class: "bg-accent rounded-md p-1",
            },
        },
        horizontalRule: {
            HTMLAttributes: {
                class: "my-2",
            },
        },
        codeBlock: {
            HTMLAttributes: {
                class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
            },
        },
        heading: {
            levels: [1, 2, 3, 4],
            HTMLAttributes: {
                class: "tiptap-heading",
            },
        },
    }),
    Link,
    Underline,
];

interface RichTextViewerProps {
    content: string;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
    const editor = useEditor({
        extensions: extensions as Extension[],
        editable: false,
        content,
    });

    return <EditorContent editor={editor} />;
}
