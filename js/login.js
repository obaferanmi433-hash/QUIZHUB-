<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Log in – QuizHub</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/forms.css">
</head>
<body>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html">Quiz<span>Hub</span></a>
    </div>
  </header>
  <main class="container">
    <div class="card form-card">
      <div id="message"></div>
      <p class="sub" id="checking">Checking your login...</p>

      <div id="loginView" style="display:none">
        <h1>Welcome back</h1>
        <p class="sub">Log in to your QuizHub account.</p>
        <form id="loginForm">
          <div class="field"><label for="email">Email</label>
            <input id="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="password">Password</label>
            <input id="password" type="password" autocomplete="current-password" required></div>
          <button class="btn btn-primary" id="submitBtn" type="submit">Log in</button>
        </form>
        <p class="form-foot"><a href="#" id="resetLink">Forgot your password?</a></p>
        <p class="form-foot">New here? <a href="register.html">Create an account</a></p>
      </div>

      <div id="loggedInView" style="display:none">
        <h1>You are logged in</h1>
        <p class="sub" id="whoami"></p>
        <a class="btn btn-teal" href="index.html">Go to homepage</a>
        <p style="height:10px"></p>
        <button class="btn btn-outline" id="logoutBtn" type="button">Log out</button>
      </div>
    </div>
  </main>

  <script>
    // Safety net: if the main script fails, tell the user instead of staying blank
    setTimeout(function () {
      var c = document.getElementById("checking");
      if (c && c.style.display !== "none") {
        c.textContent = "Could not load the login script. Check that js/login.js and js/firebase.js exist in the js folder.";
        c.style.color = "#b91c1c";
      }
    }, 6000);
  </script>
  <script type="module" src="js/login.js?v=2"></script>
</body>
</html>
