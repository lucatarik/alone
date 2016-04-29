<?php
define ('CONTACT_LIST_DIR',  getcwd());
$worklist = array();
if (is_dir(CONTACT_LIST_DIR))
{
   if ($dh = opendir(CONTACT_LIST_DIR))
   {
      while (($filename = readdir($dh)) !== false)
      {
         if (preg_match("/\.png/", $filename, $ids))
         {
            $worklist[] = $filename;
         }
      }
      closedir($dh);
   }
} 
$out = "CREATE TABLE \"card\" (
                     card	TEXT NOT NULL
                  );\n";
foreach ($worklist as $filename)
{
  
    $out.= "INSERT INTO `card` VALUES ('$filename');\n";       
}
$out.= "\n\n\n";
file_put_contents("card.sql", $out);
