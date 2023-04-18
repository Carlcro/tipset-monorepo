import { ReactNode, createContext, useContext, useReducer } from "react";

const BetslipContext = createContext(null);

const TasksDispatchContext = createContext(null);

type Props = {
  children?: ReactNode;
  // any props that come into the component
};

export function TasksProvider({ children }: Props) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <BetslipContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </BetslipContext.Provider>
  );
}

export function useTasks() {
  return useContext(BetslipContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: "Philosopher’s Path", done: true },
  { id: 1, text: "Visit the temple", done: false },
  { id: 2, text: "Drink matcha", done: false },
];
