<?php

namespace App\Libraries;

require_once(APPPATH . 'ThirdParty/JpGraph/src/jpgraph.php');
require_once(APPPATH . 'ThirdParty/JpGraph/src/jpgraph_pie.php');

class GenerarImagen {
    public function generateImage(array $data, array $labels)
    {
        $graph = new \PieGraph(500, 420);
        $graph->ClearTheme();
        $graph->SetMargin(0, 0, 0, 50);
        $p1 = new \PiePlot($data);
        $p1->SetLegends($labels);
        $p1->value->SetFont(FF_VERDANA, FS_NORMAL);
        $p1->value->SetColor("black");
        $colors = ["#e48a32", "#541b78", "#8537bc", "#b75d0d", "#913d13"];
        $p1->SetSliceColors($colors);
        $p1->SetCenter(0.5, 0.45);
        $graph->Add($p1);
        $graph->legend->SetColumns(2);
        $graph->legend->SetFrameWeight(0);
        $graph->legend->SetPos(0.5, 0.95, 'center', 'bottom');
        $graph->legend->SetFont(FF_VERDANA, FS_NORMAL, 8);

        ob_start();
        $graph->Stroke();
        $imageData = ob_get_contents();

        ob_end_clean();
        return $imageData;
    }
}