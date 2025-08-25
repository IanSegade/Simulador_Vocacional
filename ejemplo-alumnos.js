import { Ollama } from "@llamaindex/ollama";
import { Settings } from "llamaindex";
import readline from "readline";

// Configura el modelo Ollama
// Asegúrate de tener el modelo descargado y corriendo en tu máquina
// Baja ollama  de https://ollama.com/ 
// corre el siguiente comando en la terminal: `ollama run gemma3:1b`
const ollamaLLM = new Ollama({
  model: "gemma3:1b", // Cambia el modelo si lo deseas por ejemplo : "mistral:7b", "llama2:7b", etc.
  temperature: 0.75,
});

const HistorialConversacion = [
  {
    role: "system",
    content: `Sos un orientador vocacional amable y empático. 
    Tu objetivo es hacer preguntas sobre gustos e intereses 
    y sugerir trayectorias educativas o laborales en función de las respuestas. 
    Usa un lenguaje amable, claro y accesible para cualquier usuario.`
  }
];

const preguntasDefault = [
  "¿Cuáles son tus actividades extracurriculares favoritas y tus materias favoritas del colegio?",
  "¿Te gustan los actividades más prácticos y técnicas o preferís lo que son más abstractas y creativas?",
  "¿Cuál es un tema del que no conoces mucho y te gustaría aprender más sobre el?",
];

let preguntaIndex = 0;

// Asigna Ollama como LLM y modelo de embeddings
Settings.llm = ollamaLLM;
Settings.embedModel = ollamaLLM;

// Función principal
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🎓 Bot Vocacional iniciado.");
  console.log("Voy a hacer un par de preguntas para conocerte y sugerirte trayectorias educativas o laborales en función de tus respuestas.");
  console.log("Escribí 'salir' si querés terminar.\n");

  console.log("🤖 IA:", preguntas[preguntaIndex]);

  rl.on("line", async (input) => {
    if (input.toLowerCase() === "salir") {
      rl.close();
      return;
    }

    conversationHistory.push({ role: "user", content: input });

    preguntaIndex++;

    if (preguntaIndex < preguntas.length) {
      console.log("🤖 IA:", preguntas[preguntaIndex]);
    } else {
      try {
        conversationHistory.push({
          role: "system",
          content: "Con toda la información recolectada sugerile al menos 2 posibles carreras o trayectorias educativas adecuadas para el usuario y justifica el motivo."
        });

        const res = await ollamaLLM.chat({
          messages: conversationHistory,
        });

        const respuesta = res?.message?.content || res?.message || "";
        console.log("\n🎓 Orientación Vocacional:");
        console.log("🤖 IA:", respuesta.trim());

        console.log("\nEscribí 'salir' para terminar o contame más sobre ti para profundizar.");
      } catch (err) {
        console.error("⚠️ Error al llamar al modelo:", err);
      }
    }
  });
}

main();