<?php

$asset = $_GET['search']; 
$market = $_GET['country'] ? $_GET['country'] : 'US';

$stocks = json_decode( file_get_contents( "stocks_list_$market.json" ), true );

if ( !isset( $asset ) ) {
  $result = $stocks;
} else {
  $result = array();
}


  for ($i=0; $i < sizeof( $stocks ); $i++) { 
    $name_match = strpos( strtolower( $stocks[$i]['name'] ), strtolower( $asset ) ) !== false;
    $symbol_match = strpos( strtolower( $stocks[$i]['symbol'] ), strtolower( $asset ) ) !== false;
  
    if ( $name_match || $symbol_match ) {
      $result[$i] = $stocks[$i];
      $symbol = $result[$i]['symbol'];

      $csv = file( "data/$market/$symbol.csv" );

      array_reverse( $csv );
    
      foreach( $csv as $num => $row ) {
        if( $num < sizeof( $csv ) - 1 ) {
          $data = explode( ',', $row );
          $close_price = floatval($data[4]);
          $open_price = floatval($data[1]);

          $result[$i]['closePrices'][$num] = ( $close_price );
          $result[$i]['dailyChange'][$num] = $open_price ? (( $close_price ) - ( $open_price )) / ( $open_price ) : 0;
        }
      }

      $result[$i]['symbol'] = str_replace( '.SA', '', $result[$i]['symbol'] );

      $result[$i]['closePrices'] = (array_values( $result[$i]['closePrices'] ));
      $result[$i]['dailyChange'] = (array_values( $result[$i]['dailyChange'] ));
    }
  }

echo json_encode( array_values( $result ), JSON_UNESCAPED_SLASHES );