import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";
import 'dotenv/config';

const PORT = process.env.PORT;
const GENAI_KEY = process.env.GENAI_KEY;

const app = express();
const router = express.Router();
const ai = new GoogleGenAI({ apiKey: GENAI_KEY });

const whitelist = ["http://localhost:3000", "http://localhost:5173"];
const corsOptions = {
  origin: whitelist,
}
app.use(cors(corsOptions));

let counter = 0;
// task: string, priority: "high" | "medium" | "low", progress: 


app.use(express.json());

app.post('/api/schedule-prompt', async (req, res) => {
  if (counter > 100) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Invalid content type' });
  }

  const reqBody = req.body;

  if (!reqBody || !reqBody.reqTodo) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const reqTodo = reqBody.reqTodo;

  if (reqTodo.length === 0) {
    return res.status(400).json({ error: 'No tasks provided' });
  }

  if (reqTodo.some(task => typeof task.task !== 'string' || typeof task.priority !== 'string' || typeof task.progress !== 'number')) {
    return res.status(400).json({ error: 'Invalid task format' });
  }

  if (reqTodo.some(task => task.progress < 0 || task.progress > 100)) {
    return res.status(400).json({ error: 'Progress must be between 0 and 100' });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
        contents: `
          あなたはスケジュール管理のエキスパートです。
          タスクは配列にタスクのオブジェクトが格納された形で以下の形式で与えられます。
          タスクのオブジェクトは以下の形式です。
          
          {
            id: number, // タスクのID
            task: string, // タスクの内容   
            priority: "high" | "medium" | "low", // タスクの優先度
            progress: number, // タスクの進捗度（0-100）
          }

          taskは、\nで区切られている場合でも、1つのタスクとして扱ってください。
          例えば、以下のようなタスクが与えられた場合、\nで区切られている部分は1つのタスクとして扱ってください。
          {
            id: 1,
            task: '研究のための論文を読む\n研究のためのインタビューの質問項目の作成',
            priority: 'medium',
            progress: 0, 
          }

          以下が実際にあなたにスケジュールを作成してもらうためのタスクの配列です。
          ${JSON.stringify(reqTodo)}

          これらのタスクをもとに、8:00から21:30までの時間帯に分けて、各時間帯にやるべきタスクを出力してください。
          各時間帯は30分刻みで、8:00から21:30までの時間帯を考慮してください。
          例えば、8:00から8:30の時間帯には、todo.taskの内容を出力してください。
          タスクをする量は、todo.taskの内容とtodo.priorityとtodo.progressを考慮してください。
          進捗度が100のタスクはスケジュールに組み込まないでください。
          また、12:00から13:00の時間帯は昼休みとし、19:00から20:00は夕食の時間とし、タスクを組み込まないでください。
          タスクを組み込まない時間帯は、nullを出力してください。

          
          タスクはなるべく分散してスケジュールに組み込んでください。
          しかし、作業時間は合計で8時間を超えないようにしてください。

          出力はJSON形式で、各時間帯をキーにして、その時間帯にやるべきタスクを値にしてください。

        `,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    '8:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '8:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '9:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '9:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '10:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '10:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '11:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '11:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '12:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '12:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '13:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '13:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '14:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '14:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '15:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '15:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '16:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '16:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '17:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '17:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '18:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '18:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '19:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '19:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '20:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '20:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '21:00': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                    '21:30': {
                        type: Type.STRING,
                        description: 'この時間にやるべきtaskを出力してください',
                        nullable: true,
                    },
                },
                required: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
                propertyOrdering: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
            },
        },
  })

  counter++;
  const targetJson = JSON.parse(response.candidates[0].content.parts[0].text);
  const schedule = {
    schedule: [],
  };
  
  schedule.schedule = Object.entries(targetJson).map(([key, value]) => {
      return {
        time: key,
        task: value,
      };
    })
  
  res.status(200).json(schedule);
})

app.get('/', (req, res) => {
  const jsonResponse = {
    message: 'Hello from the backend!',
    id: 1,
  }
  res.status(200).json(jsonResponse);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})