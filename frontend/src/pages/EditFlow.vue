<template>
  <div class="editor">
    <!-- Sidebar: Add Nodes -->
    <div class="sidebar">
      <div class="header">
        <h2>Flow Editor</h2>
        <div class="toolbar">
          <button @click="addNode('simple-node')">+ Simple</button>
          <button @click="addNode('input-node')">+ Input</button>
          <button @click="addNode('end-node')">+ End</button>
        </div>
      </div>
      
      <div class="node-list">
        <h3>All Nodes</h3>
        <div
          v-for="node in flow"
          :key="node.id"
          class="node-item"
          :class="{ selected: selected?.id === node.id }"
          @click="selectNode(node)"
        >
          <span class="badge">{{ node.type.replace('-node', '') }}</span>
          <div class="title">{{ node.title || node.question || 'No Title' }}</div>
        </div>
      </div>

      <button class="export-btn" @click="exportJson">Copy JSON to Clipboard</button>
    </div>

    <!-- Canvas: Vertical Scrollable Flow -->
    <div class="canvas-viewport">
      <svg :width="canvasSize.width" :height="canvasSize.height" class="canvas-svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        <!-- Connections -->
        <g v-for="node in flow" :key="'lines-' + node.id">
          <path
            v-for="conn in getConnections(node)"
            :key="node.id + '-' + conn.to"
            :d="generateVerticalPath(node.id, conn.to)"
            :stroke="getConnColor(conn.type)"
            stroke-width="2"
            fill="none"
            marker-end="url(#arrowhead)"
            class="flow-path"
          />
        </g>

        <!-- Nodes -->
        <g
          v-for="node in flow"
          :key="node.id"
          :transform="`translate(${positions[node.id]?.x || 0}, ${positions[node.id]?.y || 0})`"
          @click="selectNode(node)"
          class="node-group"
        >
          <rect
            width="200"
            height="80"
            rx="12"
            :class="{ 'node-rect': true, 'is-selected': selected?.id === node.id }"
          />
          <text x="12" y="22" class="node-label">{{ node.type.toUpperCase() }}</text>
          <foreignObject x="12" y="30" width="176" height="42">
            <div class="node-content-html" xmlns="http://www.w3.org/1999/xhtml">
              {{ node.title || node.question || 'Unnamed Node' }}
            </div>
          </foreignObject>
        </g>
      </svg>
    </div>

    <!-- Inspector: Edit Properties & Connections -->
    <div class="inspector" v-if="selected">
      <h2>Edit Node</h2>
      
      <div class="field">
        <label>Title</label>
        <input v-model="selected.title" placeholder="Node Title" />
      </div>

      <div class="field" v-if="'question' in selected">
        <label>Question</label>
        <textarea v-model="selected.question" rows="3" />
      </div>

      <hr class="divider" />

      <!-- Connection Editor -->
      <div v-if="selected.type !== 'end-node'">
        <div class="logic-header">
          <h3>Connections</h3>
          <button class="toggle-logic-btn" @click="toggleLogicType">
            {{ isIfOp(selected.next) ? 'Switch to Simple' : 'Switch to IF' }}
          </button>
        </div>

        <!-- Simple Connection -->
        <div v-if="typeof selected.next === 'string'" class="conn-box">
          <label>Target Node</label>
          <select v-model="selected.next">
            <option value="">-- No Connection --</option>
            <option v-for="n in flow" :key="n.id" :value="n.id" :disabled="n.id === selected.id">
              {{ n.title || n.id.slice(0,8) }} ({{ n.type }})
            </option>
          </select>
        </div>

        <!-- IF Connection -->
        <div v-else-if="isIfOp(selected.next)" class="conn-box if-box">
          <label>Condition</label>
          <input v-model="selected.next.val" placeholder="e.g. status === 'ok'" />

          <label class="green-label">True Path (LHS)</label>
          <select v-model="selected.next.lhs">
            <option v-for="n in flow" :key="n.id" :value="n.id">{{ n.title || n.id.slice(0,8) }}</option>
          </select>

          <label class="red-label">False Path (RHS)</label>
          <select v-model="selected.next.rhs">
            <option v-for="n in flow" :key="n.id" :value="n.id">{{ n.title || n.id.slice(0,8) }}</option>
          </select>
        </div>
      </div>

      <button class="delete-btn" @click="deleteNode(selected.id)">Delete Node</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue"
import { Node, NodeType, Operation } from "../types";
import { fetchFlow } from "../api";

const flow = ref<Node[]>([])
const positions = reactive<Record<string, { x: number; y: number }>>({})
const selected = ref<Node | null>(null)

// 1. Dynamic Canvas Size
const canvasSize = computed(() => {
  const posArray = Object.values(positions);
  if (posArray.length === 0) return { width: 1000, height: 1000 };
  const maxX = Math.max(...posArray.map(p => p.x)) + 400;
  const maxY = Math.max(...posArray.map(p => p.y)) + 300;
  return { width: maxX, height: maxY };
});

// 2. Fetch Initial Data
onMounted(async () => {
  try {
    const data = await fetchFlow();
    flow.value = data;
    layoutFlowVertical();
  } catch (e) {
    console.error("Fetch failed", e);
  }
});

// 3. Logic: Extracting Targets
function isIfOp(next: any): next is Extract<Operation, { op: "if" }> {
  return next && typeof next === 'object' && next.op === 'if';
}

function getConnections(node: Node) {
  const conns: { to: string; type: 'default' | 'true' | 'false' }[] = [];
  if (!node || !node.next) return conns;

  if (typeof node.next === 'string') {
    conns.push({ to: node.next, type: 'default' });
  } else if (isIfOp(node.next)) {
    if (typeof node.next.lhs === 'string') conns.push({ to: node.next.lhs, type: 'true' });
    if (typeof node.next.rhs === 'string') conns.push({ to: node.next.rhs, type: 'false' });
  }
  return conns.filter(c => flow.value.some(n => n.id === c.to));
}

// 4. Beautiful Layout Engine (Vertical)
function layoutFlowVertical() {
  if (flow.value.length === 0) return;

  const ranks: Record<string, number> = {};
  const visited = new Set<string>();
  const rows: string[][] = [];

  const startNodes = flow.value.filter(n => n.type === 'start-node');
  const queue: { id: string; rank: number }[] = startNodes.map(n => ({ id: n.id, rank: 0 }));
  
  // Also include nodes with no incoming connections as roots
  const allTargets = new Set(flow.value.flatMap(n => getConnections(n).map(c => c.to)));
  flow.value.forEach(n => {
    if (!allTargets.has(n.id) && n.type !== 'start-node') {
      queue.push({ id: n.id, rank: 0 });
    }
  });

  while (queue.length > 0) {
    const { id, rank } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    if (!rows[rank]) rows[rank] = [];
    rows[rank].push(id);

    const node = flow.value.find(n => n.id === id);
    if (node) {
      getConnections(node).forEach(conn => {
        queue.push({ id: conn.to, rank: rank + 1 });
      });
    }
  }

  // Visual Positioning
  const V_GAP = 180;
  const H_GAP = 240;
  const CENTER_X = 500;

  rows.forEach((nodeIds, r) => {
    const rowWidth = (nodeIds.length - 1) * H_GAP;
    nodeIds.forEach((id, c) => {
      positions[id] = {
        x: CENTER_X + (c * H_GAP) - (rowWidth / 2),
        y: 80 + (r * V_GAP)
      };
    });
  });
}

// 5. Actions
function addNode(type: NodeType) {
  const id = crypto.randomUUID();
  const newNode: any = { id, type, title: `New ${type}`, next: type === 'end-node' ? undefined : "" };
  if (type === 'input-node') newNode.question = "Enter question here?";
  flow.value.push(newNode);
  selectNode(newNode);
}

function toggleLogicType() {
  if (!selected.value) return;
  if (typeof selected.value.next === 'string') {
    selected.value.next = { op: 'if', val: 'true', lhs: selected.value.next, rhs: '' };
  } else {
    selected.value.next = (selected.value.next as any).lhs || '';
  }
}

function deleteNode(id: string) {
  flow.value = flow.value.filter(n => n.id !== id);
  if (selected.value?.id === id) selected.value = null;
}

function selectNode(node: Node) { selected.value = node; }

function generateVerticalPath(fromId: string, toId: string) {
  const start = positions[fromId];
  const end = positions[toId];
  if (!start || !end) return "";
  const x1 = start.x + 100, y1 = start.y + 80, x2 = end.x + 100, y2 = end.y;
  const midY = y1 + (y2 - y1) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

function getConnColor(type: string) {
  return type === 'true' ? '#22c55e' : type === 'false' ? '#ef4444' : '#64748b';
}

function exportJson() {
  navigator.clipboard.writeText(JSON.stringify(flow.value, null, 2));
  alert("JSON Copied!");
}

// Re-layout whenever anything changes
watch(flow, () => layoutFlowVertical(), { deep: true });
</script>

<style scoped>
.editor { display: flex; height: 100vh; background: #0f172a; color: #f1f5f9; overflow: hidden; font-family: sans-serif; }

/* Sidebar & Inspector */
.sidebar, .inspector { 
  width: 300px; padding: 20px; background: #1e293b; border-right: 1px solid #334155; 
  display: flex; flex-direction: column; overflow-y: auto; z-index: 10;
}
.inspector { border-right: none; border-left: 1px solid #334155; }

.toolbar { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
.toolbar button { background: #334155; font-size: 11px; }

/* Canvas Viewport */
.canvas-viewport { flex: 1; overflow: auto; position: relative; cursor: grab; background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 40px 40px; }
.canvas-svg { display: block; margin: auto; }

/* Node Styles */
.node-rect { fill: #1e293b; stroke: #475569; stroke-width: 2; transition: 0.2s; }
.node-rect.is-selected { stroke: #38bdf8; fill: #0f172a; }
.node-label { fill: #38bdf8; font-size: 9px; font-weight: bold; }
.node-content-html { color: white; font-size: 11px; line-height: 1.4; padding: 0 4px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* Connection Lines */
.flow-path { transition: 0.3s; pointer-events: none; }

/* Form Elements */
.field { margin-bottom: 15px; }
label { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
input, select, textarea { background: #0f172a; color: white; border: 1px solid #334155; padding: 10px; border-radius: 6px; width: 100%; font-size: 13px; box-sizing: border-box; }
.conn-box { background: #1a1a1b; padding: 12px; border-radius: 8px; margin-top: 10px; border: 1px solid #334155; }
.if-box { border-left: 4px solid #38bdf8; }
.divider { border: 0; border-top: 1px solid #334155; margin: 20px 0; }

.toggle-logic-btn { background: #38bdf8; color: #0f172a; font-size: 10px; padding: 4px 8px; }
.delete-btn { background: #ef4444; color: white; margin-top: 20px; border: none; padding: 12px; border-radius: 6px; cursor: pointer; }

/* List */
.node-item { padding: 10px; background: #334155; border-radius: 6px; cursor: pointer; border: 1px solid transparent; margin-bottom: 8px; }
.node-item.selected { border-color: #38bdf8; background: #0f172a; }
.badge { font-size: 8px; background: #38bdf8; color: #0f172a; padding: 2px 4px; border-radius: 3px; font-weight: bold; display: inline-block; margin-bottom: 4px; }
.green-label { color: #22c55e; margin-top: 10px; }
.red-label { color: #ef4444; margin-top: 10px; }
</style>