"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, X } from "lucide-react";
import { PanelSection } from "./panel-section";
import type { Agent } from "@/lib/types";
import { useState } from "react";

interface AgentsListProps {
  agents: Agent[];
  currentAgent: string;
}

export function AgentsList({ agents, currentAgent }: AgentsListProps) {
  const activeAgent = agents.find((a) => a.name === currentAgent);

  const [showForm, setShowForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; agentName: string | null }>({ open: false, agentName: null });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [form, setForm] = useState({ name: "", description: "", instructions: "" });
  const [error, setError] = useState<string | null>(null);

  const hardcodedAgents = [
    "Triage Agent",
    "FAQ Agent",
    "Seat Booking Agent",
    "Flight Status Agent",
    "Cancellation Agent",
    "HR Agent",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
        const res = await fetch(`${API_URL}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Erro ao criar agente");
        return;
      }
      setShowForm(false);
      setForm({ name: "", description: "", instructions: "" });
      window.location.reload(); 
    } catch (err) {
      setError("Erro ao criar agente");
    }
  };

  return (
  <PanelSection
    title="Available Agents"
    icon={<Bot className="h-4 w-4 text-blue-600" />}
  >
    <button
      className="mb-2 px-3 py-1 bg-blue-600 text-white rounded"
      onClick={() => setShowForm((v) => !v)}
    >
      + Add Agent
    </button>
    {showForm && (
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 bg-white p-3 rounded shadow">
        <input
          placeholder="Agent Name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          className="border p-1 rounded"
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="border p-1 rounded"
        />
        <textarea
          placeholder="Instructions/Prompt"
          value={form.instructions}
          onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
          required
          className="border p-1 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white rounded px-2 py-1">Add</button>
        {error && <div className="text-red-600 text-xs">{error}</div>}
      </form>
    )}
    <div className="grid grid-cols-3 gap-3">
      {agents.map((agent) => (
        <Card
          key={agent.name}
          className={`relative group bg-white border-gray-200 transition-all ${
            agent.name === currentAgent ||
            activeAgent?.handoffs.includes(agent.name)
              ? ""
              : "opacity-50 filter grayscale cursor-not-allowed pointer-events-none"
          } ${
            agent.name === currentAgent ? "ring-1 ring-blue-500 shadow-md" : ""
          }`}
        >
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-sm flex items-center text-zinc-900">
              {agent.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <p className="text-xs font-light text-zinc-500">
              {agent.description}
            </p>
            {agent.name === currentAgent && (
              <Badge className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
                Active
              </Badge>
            )}
          </CardContent>
          {!hardcodedAgents.includes(agent.name) && (
            <button
              title="Delete agent"
              className="absolute bottom-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-red-100 transition-opacity opacity-0 group-hover:opacity-100 hover:opacity-100"
              style={{ zIndex: 10 }}
              onClick={() => setDeleteModal({ open: true, agentName: agent.name })}
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          )}
        </Card>
      ))}
    </div>
    {deleteModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
          <div className="mb-4 text-center">
            <p className="text-lg font-semibold text-zinc-800">Excluir agente?</p>
            <p className="text-sm text-zinc-500 mt-1">
              Tem certeza que deseja excluir o agente <span className="font-bold">{deleteModal.agentName}</span>?
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <button
              className="px-4 py-1 rounded bg-zinc-200 text-zinc-700 hover:bg-zinc-300"
              onClick={() => setDeleteModal({ open: false, agentName: null })}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                await fetch(`${API_URL}/agents/${encodeURIComponent(deleteModal.agentName!)}`, {
                  method: "DELETE",
                });
                setDeleteModal({ open: false, agentName: null });
                window.location.reload();
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    )}
  </PanelSection>
);
}