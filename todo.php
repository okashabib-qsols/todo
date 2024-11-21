<?php
  require './db/index.php';
  $get_all_list = "SELECT description, isDone, ItemPosition, color FROM list";
  $get = $conn->query($get_all_list);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <title>Todo</title>
</head>
<body>
<div id="page-wrap">
    <div id="header">
      <h1><a href="">PHP Sample Test App</a></h1>
    </div>

    <div id="main">
      <noscript>This site just doesn't work, period, without JavaScript</noscript>
      <ul id="list" class="ui-sortable">
      </ul>
	  <br />

      <form id="add-new" method="post">
        <input type="text" id="new-list-item-text" name="description" />
        <input type="submit" id="add-new-submit" value="Add" class="button" />
      </form>

      <div class="clear"></div>
    </div>
  </div>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
  <script src="./app.js"></script>
</body>
</html>