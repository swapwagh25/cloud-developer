import express, { response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { TimeoutError } from 'bluebird';
const isImageUrl = require('is-image-url');
const axios = require('axios');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });
  
  app.get( "/filteredimage", async ( req, res ) => {
    let {image_url}= req.query;
      
      //console.log(image_url);
      axios({
        method: 'get',
        url: image_url,
        timeout: 1000 * 5, // Wait for 5 seconds
      })
        .then(function (response: any) {
          const headers = response.headers;
          if (headers && headers['content-type']) {
            const isImage =  headers['content-type'].search(/^image\//) != -1; //    1. validate the image_url query
          if (isImage) {
            filterImageFromURL(image_url).then( response => { //    2. call filterImageFromURL(image_url) to filter the image
              //console.log(response);
             var path: any[] | string[]=[];
             path[path.length]=response;
            //res.sendFile(response); //    3. send the resulting file in the response
            
            res.sendFile(response, function (error) {
              if (error) {
                res.send("There was an error saving the image to /tmp")
              } else {
                deleteLocalFiles(path); //    4. deletes any files on the server on finish of the response
                console.log('Sent:', response)
              }
            })

                }).catch(error => {
                  res.send("There was an error saving the image to /tmp")
                })
          } else {
            res.send("The url is not an image")
          }
          }
          }).catch((error: any) => {
          res.send("There was an error accessing the image")
        });
    } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();