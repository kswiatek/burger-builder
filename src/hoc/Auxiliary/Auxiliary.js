<!doctype html>
<html ng-app> <!--to m�wi, �e korzysta z angularaJs-->
    <head>
        <title>AngularJs Hello World</title>
    </head>
    <body>
        First Name: <input ng-model="name" /> <!--to binduje/wrzuca DO modelu to co tutaj mamy-->
        <br/>
        {{name}}  <!--potem tylko wypisujemy Z modelu-->
        <script src="angular.js"></script> <!--ca�y angularJs jest w pliczku angular.js lol-->
    </body>
</html>