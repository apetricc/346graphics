vertices = [
    vec3 (-1,-1,-1),  //0
    vec3 (1,-1,-1),   //1  
    vec3 (1,1,-1),    //2  
    vec3 (-1,1,-1),    //3
    vec3 (-1,-1, 1),    //4
    vec3 (1,-1,1),    //5
    vec3 (1,1,1),    //6
    vec3 (-1,1,1),    //7
];

Faces = [
    [0, 1, 2, 3],   //front face
    [4, 5, 6, 7],   //back face
    [0, 3, 7, 4],   //left face
    [1, 5, 6, 2],   //right face
    [3, 2, 6, 7],   // top face
    [0, 2, 5, 1]    //bottom face
    ];


