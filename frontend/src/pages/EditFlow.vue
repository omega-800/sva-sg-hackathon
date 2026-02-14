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
          <div class="title">{{ (node as any).title || (node as any).question || 'No Title' }}</div>
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
              {{ (node as any).title || (node as any).question || 'Unnamed Node' }}
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
            {{ isIfOp((selected as any).next) ? 'Switch to Simple' : 'Switch to IF' }}
          </button>
        </div>

        <!-- Simple Connection -->
        <div v-if="typeof (selected as any).next === 'string'" class="conn-box">
          <label>Target Node</label>
          <select v-model="(selected as any).next">
            <option value="">-- No Connection --</option>
            <option v-for="n in flow" :key="n.id" :value="n.id" :disabled="n.id === selected.id">
              {{ (n as any).title || n.id.slice(0,8) }} ({{ n.type }})
            </option>
          </select>
        </div>

        <!-- IF Connection -->
        <div v-else-if="isIfOp((selected as any).next)" class="conn-box if-box">
          <label>Condition</label>
          <input v-model="(selected as any).next.val" placeholder="e.g. status === 'ok'" />

          <label class="green-label">True Path (LHS)</label>
          <select v-model="(selected as any).next.lhs">
            <option v-for="n in flow" :key="n.id" :value="n.id">{{ (n as any).title || n.id.slice(0,8) }}</option>
          </select>

          <label class="red-label">False Path (RHS)</label>
          <select v-model="(selected as any).next.rhs">
            <option v-for="n in flow" :key="n.id" :value="n.id">{{ (n as any).title || n.id.slice(0,8) }}</option>
          </select>
        </div>
      </div>

      <button class="delete-btn" @click="deleteNode(selected.id)">Delete Node</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue"
import { NodeType, Operation, Flowchart, Node as FlowNode } from "../types";
import { fetchFlow } from "../api";

type AnyNode = Flowchart[number];

const flow = ref<AnyNode[]>([])
const positions = reactive<Record<string, { x: number; y: number }>>({})
const virtualPoints = reactive<Record<string, { x: number; y: number }>>({})
const selected = ref<AnyNode | null>(null)

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

function getConnections(node: AnyNode) {
  const conns: { to: string; type: 'default' | 'true' | 'false' }[] = [];
  if (!node || node.type === 'end-node') return conns;
  
  const next = (node as FlowNode).next;
  if (!next) return conns;

  if (typeof next === 'string') {
    conns.push({ to: next, type: 'default' });
  } else if (isIfOp(next)) {
    if (typeof next.lhs === 'string') conns.push({ to: next.lhs, type: 'true' });
    if (typeof next.rhs === 'string') conns.push({ to: next.rhs, type: 'false' });
  }
  return conns.filter(c => flow.value.some(n => n.id === c.to));
}

// 4. Beautiful Layout Engine (Vertical + Sugiyama)
function layoutFlowVertical() {
  if (flow.value.length === 0) return;

  // Clear old virtual points
  for (const k in virtualPoints) delete virtualPoints[k];

  // 1. Ranking (Longest Path)
  const ranks: Record<string, number> = {};
  flow.value.forEach(n => ranks[n.id] = 0);
  for (let i = 0; i < flow.value.length; i++) {
    let changed = false;
    flow.value.forEach(node => {
      getConnections(node).forEach(conn => {
        if (ranks[conn.to] <= ranks[node.id]) {
          ranks[conn.to] = ranks[node.id] + 1;
          changed = true;
        }
      });
    });
    if (!changed) break;
  }

  // 2. Virtual Node Phase
  const maxRank = Math.max(...Object.values(ranks), 0);
  const rows: { id: string; isVirtual: boolean }[][] = [];
  for (let r = 0; r <= maxRank; r++) rows[r] = [];

  // Add real nodes
  flow.value.forEach(node => {
    rows[ranks[node.id]].push({ id: node.id, isVirtual: false });
  });

  // Add virtual nodes for multi-rank edges
  flow.value.forEach(node => {
    getConnections(node).forEach(conn => {
      const r1 = ranks[node.id];
      const r2 = ranks[conn.to];
      if (r2 > r1 + 1) {
        for (let r = r1 + 1; r < r2; r++) {
          const vId = `v_${node.id}_${conn.to}_${r}`;
          rows[r].push({ id: vId, isVirtual: true });
        }
      }
    });
  });

  // 3. Simple Ordering (TBD: Barycenter, but for now just insertion order works okay if stable)
  // We'll keep it simple for now as requested: "nodes should make space".

  // 4. Calculate Positions
  const V_GAP = 200;
  const H_GAP = 260; // Wide enough to see paths
  const CENTER_X = 600;

  rows.forEach((items, r) => {
    if (!items || items.length === 0) return;
    const rowWidth = (items.length - 1) * H_GAP;
    items.forEach((item, c) => {
      const x = CENTER_X + (c * H_GAP) - (rowWidth / 2);
      const y = 80 + (r * V_GAP);
      if (!item.isVirtual) {
        positions[item.id] = { x, y };
      } else {
        virtualPoints[item.id] = { x, y };
      }
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
  const selNode = selected.value as any;
  if (typeof selNode.next === 'string') {
    selNode.next = { op: 'if', val: 'true', lhs: selNode.next, rhs: '' };
  } else {
    selNode.next = (selNode.next as any).lhs || '';
  }
}

function deleteNode(id: string) {
  flow.value = flow.value.filter(n => n.id !== id);
  if (selected.value?.id === id) selected.value = null;
}

function selectNode(node: AnyNode) { selected.value = node; }

function generateVerticalPath(fromId: string, toId: string) {
  const start = positions[fromId];
  const end = positions[toId];
  if (!start || !end) return "";

  const r1 = flow.value.find(n => n.id === fromId) ? (ranksCache[fromId] ?? 0) : 0; // Need ranks here
  // Actually, we can derive rank from positions.y
  const getYRank = (y: number) => Math.round((y - 80) / 200);
  const startRank = getYRank(start.y);
  const endRank = getYRank(end.y);

  let points = [{ x: start.x + 100, y: start.y + 80 }];
  
  // Add intermediate virtual points
  for (let r = startRank + 1; r < endRank; r++) {
    const vId = `v_${fromId}_${toId}_${r}`;
    const vp = virtualPoints[vId];
    if (vp) {
      points.push({ x: vp.x, y: vp.y + 40 }); // Middle of virtual "slot"
    }
  }
  
  points.push({ x: end.x + 100, y: end.y });

  // Generate path string
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i-1];
    const p1 = points[i];
    const midY = p0.y + (p1.y - p0.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

// Helper to keep track of ranks for path generation (simplified)
const ranksCache: Record<string, number> = {};
watch(positions, () => {
  // We can't easily rely on ranksCache in generateVerticalPath if it's not reactive or if we don't update it right.
  // Using positions.y is safer.
}, { deep: true });

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