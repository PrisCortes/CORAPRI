import numpy as np
import random

GRID_SIZE = 4
ACTIONS = ["up", "down", "left", "right"]


def step(state, action):
    x, y = state

    if action == "up" and x > 0:
        x -= 1
    elif action == "down" and x < GRID_SIZE - 1:
        x += 1
    elif action == "left" and y > 0:
        y -= 1
    elif action == "right" and y < GRID_SIZE - 1:
        y += 1

    reward = 1 if (x, y) == (GRID_SIZE - 1, GRID_SIZE - 1) else -0.01

    # print(" ", reward)

    done = (x, y) == (GRID_SIZE - 1, GRID_SIZE - 1)

    return (x, y), reward, done


def random_agent(episodes=100):
    total_steps = []

    for _ in range(episodes):

        state = (0, 0)
        steps = 0
        done = False

        while not done and steps < 50:

            action = random.choice(ACTIONS)

            state, _, done = step(state, action)

            steps += 1

        total_steps.append(steps)

    return np.mean(total_steps)


def q_learning(episodes=1000, alpha=0.1, gamma=0.9, epsilon=0.2):

    q_table = {}

    # Inicializar tabla Q
    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            q_table[(x, y)] = np.zeros(len(ACTIONS))

    total_steps = []

    for _ in range(episodes):

        state = (0, 0)
        steps = 0
        done = False

        while not done and steps < 50:

            # Política epsilon-greedy
            if random.uniform(0, 1) < epsilon:
                action_idx = random.randint(0, len(ACTIONS) - 1)
            else:
                action_idx = np.argmax(q_table[state])

            # Ejecutar acción
            new_state, reward, done = step(
                state,
                ACTIONS[action_idx]
            )

            old_q = q_table[state][action_idx]

            # Q-Learning usa la MEJOR acción del siguiente estado
            future_q = np.max(q_table[new_state])

            # Fórmula Q-Learning
            q_table[state][action_idx] = (
                old_q
                + alpha
                * (
                    reward
                    + gamma * future_q
                    - old_q
                )
            )

            state = new_state
            steps += 1

        total_steps.append(steps)

    return np.mean(total_steps)


def sarsa(episodes=1000, alpha=0.1, gamma=0.9, epsilon=0.2):

    q_table = {}

    # Inicializar tabla Q
    for x in range(GRID_SIZE):
        for y in range(GRID_SIZE):
            q_table[(x, y)] = np.zeros(len(ACTIONS))

    total_steps = []

    for _ in range(episodes):

        state = (0, 0)
        steps = 0
        done = False

        # Elegir la primera acción con epsilon-greedy
        if random.uniform(0, 1) < epsilon:
            action_idx = random.randint(0, len(ACTIONS) - 1)
        else:
            action_idx = np.argmax(q_table[state])

        while not done and steps < 50:

            # Ejecutar acción actual
            new_state, reward, done = step(
                state,
                ACTIONS[action_idx]
            )

            # Elegir la siguiente acción
            if random.uniform(0, 1) < epsilon:
                new_action_idx = random.randint(
                    0,
                    len(ACTIONS) - 1
                )
            else:
                new_action_idx = np.argmax(
                    q_table[new_state]
                )

            old_q = q_table[state][action_idx]

            # SARSA utiliza el valor de la acción
            # que REALMENTE eligió
            future_q = q_table[new_state][new_action_idx]

            # Fórmula SARSA
            q_table[state][action_idx] = (
                old_q
                + alpha
                * (
                    reward
                    + gamma * future_q
                    - old_q
                )
            )

            # Avanzar al siguiente estado y acción
            state = new_state
            action_idx = new_action_idx

            steps += 1

        total_steps.append(steps)

    return np.mean(total_steps)



random_perf = random_agent(200)

q_learning_perf = q_learning(1000)

sarsa_perf = sarsa(1000)


print(
    "Promedio de pasos con agente aleatorio:",
    random_perf
)

print(
    "Promedio de pasos con Q-Learning:",
    q_learning_perf
)

print(
    "Promedio de pasos con SARSA:",
    sarsa_perf
)