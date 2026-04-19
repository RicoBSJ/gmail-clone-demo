import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Menu, Star, Plus } from "lucide-react";

const contacts = {
  Julie: "https://i.pravatar.cc/40?img=1",
  Direction: "https://i.pravatar.cc/40?img=2",
  Analyste: "https://i.pravatar.cc/40?img=3",
};

const initialThreads = [
  {
    id: 1,
    subject: "Projet X",
    participants: ["Direction"],
    snippet: "Docs confidentiels...",
    messages: [
      { text: "Docs confidentiels", time: Date.now() - 7200000 },
      { text: "Bien reçu", time: Date.now() - 3600000 }
    ],
    unread: true,
    starred: true,
    folder: "inbox"
  },
  {
    id: 2,
    subject: "Pause café",
    participants: ["Julie"],
    snippet: "On se voit ?",
    messages: [
      { text: "On se voit ?", time: Date.now() - 1800000 }
    ],
    unread: true,
    starred: false,
    folder: "inbox"
  }
];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function GmailClone() {
  const [threads, setThreads] = useState(initialThreads);
  const [selected, setSelected] = useState(null);
  const [folder, setFolder] = useState("inbox");
  const [compose, setCompose] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = threads.filter(t =>
    t.folder === folder &&
    (t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.participants[0].toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "c") setCompose(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* Topbar */}
      <div className="flex items-center px-4 h-14 border-b gap-4">
        <Menu />
        <h1 className="font-semibold text-lg">Gmail</h1>
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg w-1/2">
          <Search size={16} />
          <input
            className="bg-transparent outline-none ml-2 w-full"
            placeholder="Rechercher un mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-64 border-r p-2 space-y-2">
          <button
            onClick={() => setCompose(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Plus size={16}/> Nouveau message
          </button>

          <div className="space-y-1 mt-4">
            <div onClick={() => setFolder("inbox")} className="p-2 hover:bg-gray-100 rounded cursor-pointer">📥 Inbox</div>
            <div onClick={() => setFolder("sent")} className="p-2 hover:bg-gray-100 rounded cursor-pointer">📤 Envoyés</div>
            <div onClick={() => setFolder("archives")} className="p-2 hover:bg-gray-100 rounded cursor-pointer">🗄️ Archives</div>
          </div>
        </div>

        {/* Mail list */}
        <div className="w-96 border-r overflow-y-auto">
          {filtered.map(t => (
            <motion.div
              key={t.id}
              whileHover={{ backgroundColor: "#f5f5f5" }}
              className="flex items-center px-3 py-2 border-b cursor-pointer"
              onClick={() => setSelected(t)}
            >
              <input type="checkbox" className="mr-2" />
              <Star className={`mr-2 ${t.starred ? "fill-yellow-400" : ""}`} />

              <img src={contacts[t.participants[0]]} className="w-8 h-8 rounded-full mr-2" />

              <div className="flex-1">
                <div className="flex justify-between">
                  <span className={t.unread ? "font-bold" : ""}>{t.participants[0]}</span>
                  <span className="text-xs text-gray-400">{formatTime(t.messages[0].time)}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{t.subject}</span> - {t.snippet}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Thread view */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selected ? (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-4">{selected.subject}</h2>

              {selected.messages.map((m, i) => (
                <div key={i} className="mb-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={contacts[selected.participants[0]]} className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-medium">{selected.participants[0]}</span>
                    <span className="text-xs text-gray-400">{formatTime(m.time)}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">Sélectionnez un message</div>
          )}
        </div>
      </div>

      {/* Compose */}
      {compose && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 right-4 w-96 bg-white border shadow-xl rounded-lg"
        >
          <div className="p-2 border-b font-medium">Nouveau message</div>
          <div className="p-2">
            <input placeholder="Sujet" className="w-full border p-1 mb-2" id="subject" />
            <textarea placeholder="Message..." className="w-full border p-2 h-32" id="body" />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => setCompose(false)}
            >Envoyer</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
