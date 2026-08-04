from flask import Flask, render_template, request, redirect, url_for, session
import time
from utils import get_questions

app = Flask(__name__)
app.secret_key = "quiz_application_secret"

PASS_PERCENTAGE = 40


@app.route("/")
def home():
    session.clear()
    return render_template("index.html")


@app.route("/instructions")
def instructions():
    return render_template("instructions.html")


@app.route("/category")
def category():
    return render_template("category.html")


@app.route("/select-category/<category>")
def select_category(category):
    session["category"] = category
    return redirect(url_for("difficulty"))


@app.route("/difficulty")
def difficulty():
    return render_template("difficulty.html")


@app.route("/select-difficulty/<difficulty>")
def select_difficulty(difficulty):
    category = session.get("category")

    questions = get_questions(category, difficulty)

    if len(questions) == 0:
        return "<h2>No Questions Found!</h2>"

    session["difficulty"] = difficulty
    session["questions"] = questions
    session["current"] = 0
    session["answers"] = {}

    # Quiz duration = 60 seconds

    return redirect(url_for("quiz"))


@app.route("/quiz", methods=["GET", "POST"])
def quiz():

    if "questions" not in session:
        return redirect(url_for("home"))

    questions = session["questions"]
    current = session["current"]

    # Calculate remaining quiz time

    # Auto submit if time is over
    

    if request.method == "POST":

        action = request.form.get("action")
        selected = request.form.get("answer")

        # User cannot go Next or Submit without selecting an answer
        if action in ["next", "submit"] and not selected:

            # If timer submitted automatically, allow it
            if request.form.get("auto_submit") != "true":

                saved_answer = session["answers"].get(str(current), "")

                return render_template(
                    "quiz.html",
                    question=questions[current],
                    current=current,
                    total=len(questions),
                    saved_answer=saved_answer,
                    category=session.get("category"),
                    difficulty=session.get("difficulty"),
                    error="Please select an answer before continuing."
                )

        # Save selected answer
        if selected:
            answers = session["answers"]
            answers[str(current)] = selected
            session["answers"] = answers

        # Previous Question
        if action == "previous":
            if current > 0:
                session["current"] -= 1

        # Next Question
        elif action == "next":
            if current < len(questions) - 1:
                session["current"] += 1

        # Submit Quiz
        elif action == "submit":
            return redirect(url_for("result"))

        return redirect(url_for("quiz"))

    saved_answer = session["answers"].get(str(current), "")

    return render_template(
    "quiz.html",
    question=questions[current],
    current=current,
    total=len(questions),
    saved_answer=saved_answer,
    category=session.get("category"),
    difficulty=session.get("difficulty")
)


@app.route("/result")
def result():

    if "questions" not in session:
        return redirect(url_for("home"))

    questions = session["questions"]
    answers = session["answers"]

    score = 0
    incorrect_answers = []

    for i, question in enumerate(questions):

        user_answer = answers.get(str(i), "Not Answered")

        if user_answer == question["answer"]:
            score += 1
        else:
            incorrect_answers.append({
                "question": question["question"],
                "your_answer": user_answer,
                "correct_answer": question["answer"]
            })

    total = len(questions)
    wrong = total - score
    percentage = round((score / total) * 100)

    status = "PASS" if percentage >= PASS_PERCENTAGE else "FAIL"

    if percentage == 100:
        message = "🏆 Outstanding! Perfect Score!"
    elif percentage >= 80:
        message = "🌟 Excellent Performance!"
    elif percentage >= 60:
        message = "👍 Good Job!"
    elif percentage >= 40:
        message = "🙂 Fair Attempt!"
    else:
        message = "📚 Keep Practicing!"

    return render_template(
        "result.html",
        score=score,
        total=total,
        wrong=wrong,
        percentage=percentage,
        status=status,
        message=message,
        incorrect_answers=incorrect_answers,
        category=session["category"],
        difficulty=session["difficulty"]
    )


@app.route("/restart")
def restart():
    session.clear()
    return redirect(url_for("home"))


if __name__ == "__main__":
    app.run(debug=True)