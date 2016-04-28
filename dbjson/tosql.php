<?php
define ('CONTACT_LIST_DIR',  getcwd());
$worklist = array();
if (is_dir(CONTACT_LIST_DIR))
{
   if ($dh = opendir(CONTACT_LIST_DIR))
   {
      while (($filename = readdir($dh)) !== false)
      {
         if (preg_match("/\.json/", $filename, $ids))
         {
            $worklist[] = $filename;
         }
      }
      closedir($dh);
   }
}
foreach ($worklist as $filename)
{
   $fcont = json_decode(trim(file_get_contents($filename)),true);
   if($fcont)
   {
      if(preg_match("/(.*?)\.json/", $filename,$name))
      {
         $name=$name[1];
         echo "$name\n\n\n";
         $out = "CREATE TABLE \"{$name}\" (
                     `$name`	TEXT NOT NULL
                  );\n";
         foreach ($fcont as $row)
         {
            $row = str_replace("'", "''", $row);
            $out.= "INSERT INTO `{$name}` VALUES ('$row');\n";
         }
         $out.= "\n\n\n";
         file_put_contents($name.".sql", $out);
      }
   }
}
