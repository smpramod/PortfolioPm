export type ArchCluster = "identity" | "craft" | "work" | "close";

export type ArchNode = {
  id: string;
  position: [number, number, number];
  cluster: ArchCluster;
  radius: number;
  connections: string[];
};

const CX = 1.55;

function polar(z: number, angle: number, r: number, y = 0): [number, number, number] {
  return [CX + Math.cos(angle) * r, y + Math.sin(angle) * r * 0.45, z];
}

export const architectureNodes: ArchNode[] = [
  { id: "spine-identity", position: [CX, 0, -8], cluster: "identity", radius: 0.18, connections: [] },
  { id: "bio", position: polar(-8, 0.2, 1.35, 0.15), cluster: "identity", radius: 0.09, connections: ["spine-identity"] },
  { id: "edu", position: polar(-8, 1.4, 1.4, -0.1), cluster: "identity", radius: 0.09, connections: ["spine-identity"] },
  { id: "intern", position: polar(-8, 2.5, 1.25, 0.2), cluster: "identity", radius: 0.1, connections: ["spine-identity"] },
  { id: "place", position: polar(-8, 3.7, 1.3, -0.15), cluster: "identity", radius: 0.08, connections: ["spine-identity"] },
  { id: "open", position: polar(-8, 5.0, 1.15, 0.05), cluster: "identity", radius: 0.08, connections: ["spine-identity"] },

  { id: "hub-lang", position: polar(-16, 0.4, 0.85), cluster: "craft", radius: 0.14, connections: ["spine-identity"] },
  { id: "hub-fw", position: polar(-16, 2.0, 0.9), cluster: "craft", radius: 0.14, connections: ["hub-lang"] },
  { id: "hub-tool", position: polar(-16, 3.5, 0.85), cluster: "craft", radius: 0.14, connections: ["hub-fw"] },
  { id: "hub-concept", position: polar(-16, 5.1, 0.8), cluster: "craft", radius: 0.14, connections: ["hub-tool", "hub-lang"] },
  { id: "js", position: polar(-16, 0.15, 1.85, 0.25), cluster: "craft", radius: 0.06, connections: ["hub-lang"] },
  { id: "ts", position: polar(-16, 0.7, 1.9, -0.2), cluster: "craft", radius: 0.06, connections: ["hub-lang"] },
  { id: "react", position: polar(-16, 1.85, 1.95, 0.2), cluster: "craft", radius: 0.07, connections: ["hub-fw"] },
  { id: "next", position: polar(-16, 2.25, 1.85, -0.25), cluster: "craft", radius: 0.07, connections: ["hub-fw"] },
  { id: "git", position: polar(-16, 3.3, 1.8, 0.22), cluster: "craft", radius: 0.06, connections: ["hub-tool"] },
  { id: "mongo", position: polar(-16, 3.75, 1.9, -0.18), cluster: "craft", radius: 0.06, connections: ["hub-tool"] },
  { id: "api", position: polar(-16, 4.95, 1.75, 0.18), cluster: "craft", radius: 0.06, connections: ["hub-concept"] },
  { id: "ui", position: polar(-16, 5.4, 1.85, -0.2), cluster: "craft", radius: 0.06, connections: ["hub-concept"] },

  { id: "proj-erp", position: [CX - 0.85, 0.35, -24], cluster: "work", radius: 0.2, connections: ["hub-fw"] },
  { id: "proj-parko", position: [CX + 0.05, -0.25, -24.2], cluster: "work", radius: 0.2, connections: ["proj-erp"] },
  { id: "proj-diploma", position: [CX + 0.95, 0.28, -23.8], cluster: "work", radius: 0.18, connections: ["proj-parko"] },
  { id: "erp-next", position: [CX - 1.45, 0.75, -24.4], cluster: "work", radius: 0.06, connections: ["proj-erp"] },
  { id: "erp-nest", position: [CX - 1.35, -0.05, -23.6], cluster: "work", radius: 0.06, connections: ["proj-erp"] },
  { id: "erp-mongo", position: [CX - 0.45, 0.85, -24.6], cluster: "work", radius: 0.06, connections: ["proj-erp"] },
  { id: "parko-map", position: [CX - 0.35, -0.7, -24.5], cluster: "work", radius: 0.06, connections: ["proj-parko"] },
  { id: "parko-node", position: [CX + 0.5, -0.65, -23.7], cluster: "work", radius: 0.06, connections: ["proj-parko"] },
  { id: "dip-android", position: [CX + 1.45, 0.65, -24.3], cluster: "work", radius: 0.06, connections: ["proj-diploma"] },
  { id: "dip-fire", position: [CX + 1.4, -0.1, -23.5], cluster: "work", radius: 0.06, connections: ["proj-diploma"] },

  { id: "beacon", position: [CX, 0.05, -32], cluster: "close", radius: 0.22, connections: ["proj-erp", "proj-parko", "proj-diploma"] },
];

export const architectureIndex = new Map(architectureNodes.map((node, index) => [node.id, index]));

export function architectureEdges(): [number, number][] {
  const edges: [number, number][] = [];
  for (const node of architectureNodes) {
    const from = architectureIndex.get(node.id);
    if (from === undefined) continue;
    for (const target of node.connections) {
      const to = architectureIndex.get(target);
      if (to === undefined) continue;
      edges.push([from, to]);
    }
  }
  return edges;
}

export const CLUSTER_DEPTH: Record<ArchCluster, number> = {
  identity: -8,
  craft: -16,
  work: -24,
  close: -32,
};
