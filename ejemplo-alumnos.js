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

// Asigna Ollama como LLM y modelo de embeddings
Settings.llm = ollamaLLM;
Settings.embedModel = ollamaLLM;

// Función principal del programa
async function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🤖 Bot con IA (Ollama) iniciado.");
  console.log("Escribí tu pregunta o poné 'salir' para terminar:");

  // Escuchamos cada vez que el usuario escribe algo
  rl.on("line", async (input) => {
    if (input.toLowerCase() === "salir") {
      rl.close(); // Cerramos el programa si escribió "salir"
      return;
    }

    try {
      // Enviamos la pregunta al modelo de IA usando Ollama
      const res = await ollamaLLM.chat({
        messages: [
          {
            role: "system",
            content:"Eres un agente virtual que ayuda a los alumnos a resolver sus dudas sobre la materia de Programación 1. Responde a las preguntas como si fueras un profesor, utiliza ejemplos y explicaciones claras. No uses mas de 20 palabras"
          },
          {
            role: "user",
            content: input, // Lo que escribió el usuario
          },
        ],
      });

      // Obtenemos el texto de la respuesta
      const respuesta = res?.message?.content || res?.message || "";

      // Mostramos la respuesta en consola
      console.log("🤖 IA:", respuesta.trim());
    } catch (err) {
      // Si hay un error lo mostramos
      console.error("⚠️ Error al llamar al modelo:", err);
    }

    console.log("\nPreguntá otra cosa o escribí 'salir':");
  });
}

// Ejecutamos la función principal
main();
