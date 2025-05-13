import ExampleTheme from "./themes/ExampleTheme";
import { $createParagraphNode, $createTextNode, $getRoot, $insertNodes } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useEffect, useState } from "react";
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { Button, ButtonGroup} from '@mui/material';




function UpdatePlugin(btns) {
  const [editor] = useLexicalComposerContext();
  console.log("btns: ",btns);
  console.log("btns.btns: ",btns.btns);
  console.log("btns.saffoldBody: ",btns.saffoldBody);
  function update(text) {
    editor.update(() => {
      const root = $getRoot();
      const p = $createParagraphNode();
      p.append($createTextNode(text));
      root.append(p);
    });
  }
  return <>
    {
      btns.btns.saffoldBody.map((text,index)=>{
        return <Button
          key={index}
          onClick={() => {
            console.log(text);
            update(text);
            
          }}
        >
          {text}
        </Button>;
      })
    }
  </>
};

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const HtmlPlugin = ({ initialHtml, onHtmlChanged }) => {
  const [editor] = useLexicalComposerContext();

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
      if (!initialHtml || !isFirstRender) return;

      setIsFirstRender(false);

      editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialHtml, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          $insertNodes(nodes);
      });
  }, []);

  return (
      <OnChangePlugin
          onChange={(editorState) => {
              editorState.read(() => {
                  onHtmlChanged($generateHtmlFromNodes(editor));
              });
          }}
      />
  );
};

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode
  ]
};

export default function LexicalEditor({ changeFunc, nodePlan }) {

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            style={{ color:'#ECF2FF' }}
          >
              <UpdatePlugin
                btns={nodePlan} 
              />
                     
      </ButtonGroup>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          {/* <TreeViewPlugin /> */}
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />

          <HtmlPlugin
            onHtmlChanged={(html) => changeFunc(html)}
            initialHtml="<h1>早安！</h1><p>請在這邊打一些你的想法吧</p>"
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
