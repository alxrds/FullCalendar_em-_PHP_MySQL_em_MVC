<?php

    namespace App\Controller;

    use App\View\View;
    use App\Entity\Calendar;
    use App\DB\Connection;

    class CalendarController 
    {
        public function index()
        { 
            $view = new View('calendar/calendar.phtml');
            return $view->render();
        }

        public function new()
        {
            $connection = Connection::getInstance();
            if($_POST){
                $data = $_POST;
                if($data['id'] == ''){
                    $calendar = new Calendar($connection);
                    $success = $calendar->insert($data);
                    if($success){
                        return 1;
                    }else{
                        return 0;
                    }
                }else{
                    $calendar = new Calendar($connection);
                    $success = $calendar->update($data);
                    if($success){
                        return 2;
                    }else{
                        return 0;
                    }
                }

            }
        }

        public function list()
        {   $connection = Connection::getInstance();
            $json = (new Calendar($connection))->findAll();
            echo json_encode($json, JSON_UNESCAPED_UNICODE);
            die;
        }

        public function remove($id)
        {   
            $connection = Connection::getInstance();
            $calendar = new Calendar($connection);
            $success = $calendar->delete($id);
            if($success){
                return 3;
            }else{
                return 0;
            }
        }

        public function drop($id)
        {   
            $data = $_POST;
            $id = $data['id'];
            $connection = Connection::getInstance();
            $calendar = new Calendar($connection);
            $success = $calendar->update($data);
            if($success){
                return 4;
            }else{
                return 0;
            }
        }
    }