<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use File;

use App\Http\Requests;
use App\Marker;
use App\Photo;
use Intervention\Image\ImageManagerStatic as Image;

class AppController extends Controller
{
    public function home(){
    	return view('index');
    }

    public function index(){
    	return json_encode(Marker::with('photos')->get());
    }

    public function store(Request $request){
    	$marker = new Marker;
		$marker->title = $request->input('title');
		$marker->desc = $request->input('desc');
		$marker->kv = $request->input('kv');
		$marker->lat = $request->input('lat');
		$marker->lng = $request->input('lng');
		$marker->seen = false;

		if($request->file('files')){
			ini_set('memory_limit','256M');
			$dir = public_path().'/uploads/'.$request->input('kv');
	    	if(!file_exists($dir)){
	    		mkdir($dir);
	    	}
	    	$photos = [];
	    	foreach ($request->file('files') as $image) {
	    		if($image == null){
	    			continue;
	    		}
	    		$filename  = date("Y-m-d").'_'.uniqid().'.'.$image->getClientOriginalExtension();
	            $path = public_path('uploads/'.$request->input('kv').'/'.$filename);

	        	Image::make($image->getRealPath())->resize(1024,null,function($constraint){
	        		$constraint->aspectRatio();
	        	})->save($path);

				$photo = new Photo;
				$photo->path = 'uploads/'.$request->input('kv').'/'.$filename;
				$photos[] = $photo;
	    	}
	    	$marker->save();
	    	$marker->photos()->saveMany($photos);
	    	return redirect('/');
		}

		$marker->save();
		return redirect('/');
    }

    public function show($id){
    	$marker = Marker::find($id);
    	if($marker->seen == 0){
    		$marker->seen = 1;
    		$marker->save();
    	}
    }

    public function destroy($id){
    	$marker = Marker::find($id);

    	foreach ($marker->photos as $photo) {
    		File::delete($photo->path);
    	}

    	$marker->delete();

    	return redirect('/');
    }

   































    private function json_response($code = 200)
	{
	    // clear the old headers
	    header_remove();
	    // set the header to make sure cache is forced
	    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
	    // treat this as json
	    header('Content-Type: application/json');
	    $status = array(
	        200 => '200 OK',
	        400 => '400 Bad Request',
	        500 => '500 Internal Server Error',
	        422 => 'Validation error'
	        );
	    // ok, validation error, or failure
	    header('Status: '.$status[$code]);
	    // return the encoded json
	    return json_encode(array(
	    'status' => $code
	    ));
	}
}
