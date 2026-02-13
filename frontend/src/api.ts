import { Flowchart } from "./types";

<<<<<<< HEAD
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
=======
export const fetchFlow = (): Promise<Flowchart> =>
  new Promise<Flowchart>((r) =>
    r([
      // TODO: descriptions
      {
        id: "50cded42-3326-4919-9e0a-000000000000",
        type: "start-node",
        title: "Willkommen",
        desc: "Anspruch auf Sozialhilfe klären",
        next: "50cded42-3326-4919-9e0a-000000000001",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000001",
        type: "input-node",
        title: "Ausweis",
        question: "Was für einen Ausweis besitzen Sie?",
        path: ["personalien", "ausweis"],
        input: "radio",
        next: "50cded42-3326-4919-9e0a-000000000009",
        choices: [
          {
            title: "Schweizer",
            value: "CH",
          },
          {
            title: "C",
            value: "C",
          },
          {
            title: "B",
            value: "B",
          },
          {
            title: "B'",
            value: "B'",
          },
          {
            title: "F",
            value: "F",
          },
          {
            title: "F'",
            value: "F'",
          },
          {
            title: "S",
            value: "S",
          },
        ],
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000009",
        type: "input-node",
        input: "number",
        title: "Finanzen",
        question:
          "Für wie viele zusätzliche Personen sind Sie finanziell verantwortlich?",
        path: ["finanzen", "personen"],
        next: {
          op: "if",
          val: {
            lhs: ["finanzen", "personen"],
            op: "gt",
            rhs: 0,
          },
          lhs: "50cded42-3326-4919-9e0a-000000000012",
          rhs: "50cded42-3326-4919-9e0a-000000000017",
        },
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000012",
        type: "input-node",
        title: "Alter",
        question: "Wie alt sind Sie?",
        input: "number",
        path: ["personalien", "alter"],
        next: "50cded42-3326-4919-9e0a-000000000013",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000013",
        type: "input-node",
        title: "Wohnsituation",
        question: "Leben Sie mit weiteren Personen zusammen?",
        path: ["wohnen", "wohnform"],
        next: "50cded42-3326-4919-9e0a-000000000016",
        input: "radio",
        choices: [
          {
            title: "Wohngemeinschaft",
            value: "W",
          },
          {
            title: "Mietwohnung",
            value: "M",
          },
          {
            title: "Untermiete",
            value: "U",
          },
          {
            title: "Freund/-in",
            value: "P",
          },
          {
            title: "Hotel",
            value: "H",
          },
          {
            title: "Obdachlos",
            value: "O",
          },
          {
            title: "Grundeigentum",
            value: "G",
          },
        ],
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000017",
        type: "repeat-node",
        title: "Finanzen",
        n: ["finanzen", "personen"],
        next: "50cded42-3326-4919-9e0a-000000000016",
        sub: {
          type: "input-node",
          input: "radio",
          question: "Für wen sind Sie finanziell verantwortlich?",
          path: ["finanzen", "extraPersonen"],
          op: "add",
          choices: [
            {
              title: "Ehepartner/-in",
              value: "E",
            },
            {
              title: "Kind",
              value: "K",
            },
            {
              title: "Freund/-in",
              value: "F",
            },
          ],
        },
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000016",
        type: "input-node",
        input: "radio",
        title: "Arbeit",
        next: {
          op: "if",
          val: ["arbeit", "taetig"],
          lhs: "50cded42-3326-4919-9e0a-000000031",
          rhs: "50cded42-3326-4919-9e0a-000000034",
        },
        question: "Arbeiten Sie?",
        path: ["arbeit", "taetig"],
        choices: [
          {
            title: "Ja",
            value: true,
          },
          {
            title: "Nein",
            value: false,
          },
        ],
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000031",
        type: "input-node",
        question: "Höhe des Lohnes",
        path: ["arbeit", "lohn"],
        input: "number",
        next: "50cded42-3326-4919-9e0a-000000000032",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000032",
        type: "input-node",
        question: "Pensum",
        path: ["arbeit", "pensum"],
        input: "number",
        next: "50cded42-3326-4919-9e0a-000000000033",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000033",
        type: "input-node",
        question: "PLZ Arbeitsort",
        path: ["arbeit", "plz"],
        input: "number",
        next: "50cded42-3326-4919-9e0a-000000000034",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000034",
        type: "input-node",
        input: "radio",
        title: "Vermögen",
        question: "Haben Sie Vermögen?",
        path: ["vermoegen", "vorhanden"],
        next: {
          op: "if",
          val: ["vermoegen", "vorhanden"],
          lhs: "50cded42-3326-4919-9e0a-000000037",
          rhs: "50cded42-3326-4919-9e0a-000000040",
        },
        choices: [
          {
            title: "Ja",
            value: true,
          },
          {
            title: "Nein",
            value: false,
          },
        ],
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000037",
        type: "input-node",
        input: "number",
        title: "Vermögen",
        path: ["vermoegen", "betrag"],
        question: "Wie hoch ist Ihr Vermögen?",
        next: {
          op: "if",
          val: {
            op: "gt",
            lhs: ["vermoegen", "betrag"],
            rhs: 4000,
          },
          lhs: "50cded42-3326-4919-9e0a-0000009997",
          rhs: "50cded42-3326-4919-9e0a-000000040",
        },
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000040",
        type: "input-node",
        input: "radio",
        title: "Vermögen",
        question: "Haben Sie ein Motorfahrzeug?",
        path: ["vermoegen", "fahrzeug", "vorhanden"],
        next: {
          op: "if",
          val: ["vermoegen", "fahrzeug", "vorhanden"],
          lhs: "50cded42-3326-4919-9e0a-000000043",
          rhs: "50cded42-3326-4919-9e0a-000000999",
        },
        choices: [
          {
            title: "Ja",
            value: true,
          },
          {
            title: "Nein",
            value: false,
          },
        ],
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000043",
        type: "input-node",
        input: "number",
        title: "Vermögen",
        question: "Wie teuer ist Ihr Motorfahrzeug?",
        path: ["vermoegen", "fahrzeug", "betrag"],
        next: {
          op: "if",
          val: {
            op: "gt",
            lhs: {
              op: "add",
              lhs: ["vermoegen", "betrag"],
              rhs: ["vermoegen", "fahrzeug", "betrag"],
            },
            rhs: 4000,
          },
          lhs: "50cded42-3326-4919-9e0a-0000009997",
          rhs: "50cded42-3326-4919-9e0a-0000009998",
        },
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000997",
        type: "end-node",
        title: "Sie haben leider keinen Anspruch auf Sozialhilfe",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000998",
        type: "end-node",
        title: "Sie haben möglicherweise Anspruch auf Sozialhilfe",
      },
      {
        id: "50cded42-3326-4919-9e0a-000000000999",
        type: "end-node",
        title: "Sie haben wahrscheinlich Anspruch auf Sozialhilfe",
      },
    ]),
  );

// export const fetchRules = (): Promise<Rules> => new Promise<Rules>(r => r({}))
>>>>>>> refs/remotes/origin/main
