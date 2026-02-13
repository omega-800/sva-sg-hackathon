import { Flowchart } from "./types"

export const fetchFlow = (): Promise<Flowchart> => new Promise<Flowchart>(r => r([
  // TODO: descriptions
  {id: "50cded42-3326-4919-9e0a-000000000000", type: "start-node", title: "Willkommen", desc: "Anspruch auf Sozialhilfe klären", next: "50cded42-3326-4919-9e0a-000000000001"},
  {id: "50cded42-3326-4919-9e0a-000000000001", type: "decision-node", title: "Ausweis", question: "Was für einen Ausweis besitzen Sie?", decisions: [
    {id: "50cded42-3326-4919-9e0a-000000000002", type: "simple-node", title: "Schweizer", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000003", type: "simple-node", title: "C", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000004", type: "simple-node", title: "B", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000005", type: "simple-node", title: "B'", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000006", type: "simple-node", title: "F", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000007", type: "simple-node", title: "F'", next: "50cded42-3326-4919-9e0a-000000000009"},
    {id: "50cded42-3326-4919-9e0a-000000000008", type: "simple-node", title: "S", next: "50cded42-3326-4919-9e0a-000000000009"},
  ]},
  {id: "50cded42-3326-4919-9e0a-000000000009", type: "decision-node", title: "Finanzen", question: "Für wie viele Personen sind Sie finanziell verantwortlich?", decisions: [
    {id: "50cded42-3326-4919-9e0a-000000000010", type: "simple-node", title: "Ich", next: "50cded42-3326-4919-9e0a-000000000012"},
    {id: "50cded42-3326-4919-9e0a-000000000011", type: "simple-node", title: "Weitere", next: "50cded42-3326-4919-9e0a-000000017"},
  ]},
  {id: "50cded42-3326-4919-9e0a-000000000012", type: "input-node", title: "Alter", question: "Wie alt sind Sie?", input: "number", next: "50cded42-3326-4919-9e0a-000000000013"},
  {id: "50cded42-3326-4919-9e0a-000000000013", type: "decision-node", title: "Wohnsituation", question: "Leben Sie mit weiteren Personen zusammen?", decisions: [
    {id: "50cded42-3326-4919-9e0a-000000000014", type: "simple-node", title: "Wohngemeinschaft", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000015", type: "simple-node", title: "Freund/-in", next: "50cded42-3326-4919-9e0a-000000000016"},
  ]},
  {id: "50cded42-3326-4919-9e0a-000000000017", type: "decision-node", title: "Finanzen", question: "Für wen sind Sie finanziell verantwortlich?", decisions: [
    {id: "50cded42-3326-4919-9e0a-000000000018", type: "simple-node", title: "Ehepartner/-in", next: "50cded42-3326-4919-9e0a-000000000022"},
    {id: "50cded42-3326-4919-9e0a-000000000019", type: "simple-node", title: "Kind(er)", next: "50cded42-3326-4919-9e0a-000000000022"},
    {id: "50cded42-3326-4919-9e0a-000000000020", type: "simple-node", title: "Freund/-in", next: "50cded42-3326-4919-9e0a-000000000022"},
    {id: "50cded42-3326-4919-9e0a-000000000021", type: "input-node", question: "Weitere", input: "text", next: "50cded42-3326-4919-9e0a-000000000022"},
  ]},
  {id: "50cded42-3326-4919-9e0a-000000000022", type: "decision-node", title: "Wohnsituation", question: "Was ist Ihre Wohnsituation?", decisions: [
    {id: "50cded42-3326-4919-9e0a-000000000023", type: "simple-node", title: "Eigene Mietwohnung", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000024", type: "simple-node", title: "Untermiete", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000025", type: "simple-node", title: "Hotel/Pension", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000026", type: "simple-node", title: "Wohngemeinschaft", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000027", type: "simple-node", title: "Grundeigentum", next: "50cded42-3326-4919-9e0a-000000000016"},
    {id: "50cded42-3326-4919-9e0a-000000000028", type: "simple-node", title: "Obdachlos", next: "50cded42-3326-4919-9e0a-000000000016"},
  ]},

]))
