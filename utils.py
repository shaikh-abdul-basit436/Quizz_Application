import json
import random


def load_questions():
    with open("questions.json", "r", encoding="utf-8") as file:
        return json.load(file)


def get_questions(category, difficulty, shuffle=True):

    questions = load_questions()

    filtered = [
        question
        for question in questions
        if question["category"] == category
        and question["difficulty"] == difficulty
    ]

    if shuffle:
        random.shuffle(filtered)

    return filtered