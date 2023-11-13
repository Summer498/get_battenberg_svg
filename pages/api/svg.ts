import type { NextApiRequest, NextApiResponse } from "next";

const hex = (num:number, len:number) => (Array(len).join('0') + num.toString(16)).slice(-len);

const parseColor = (color:string | string[]) => {
  const _color = (Array.isArray(color)) ? color[0] : color;
  if (_color.startsWith('(')){
    const match = _color.match(/\((.*?)\)/);
    if(match){
      const rgb = match[1].split(',').map(num => parseInt(num, 10))
      return hex(rgb[0],2)+hex(rgb[1],2)+hex(rgb[2],2)
    }
  }
  else if (_color.match(/^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/)){
    return _color;
  }
  throw Error(`Invalid color format. (You sent: ${color}) \nPlease use a \n\t6-digit hexadecimal format (e.g., #ff0000), \n\ta 3-digit shorthand hexadecimal format (e.g., #0f0), \n\tor a decimal RGB format (e.g., (000, 000, 255)).`);
}

export default function handler (req: NextApiRequest, res: NextApiResponse<string>) {
  try{
    const col1 = parseColor(req.query.col1 || "000");
    const col2 = parseColor(req.query.col2 || "000");
    const col3 = parseColor(req.query.col3 || "000");
    const col4 = parseColor(req.query.col4 || "000");
  
    const battenberg_svg= `<svg width="99" height="99" viewBox="0 0 2 2" xmlns="http://www.w3.org/2000/svg">\n\t<rect x="0" y="0" width="1" height="1" fill="#${col1}"/>\n\t<rect x="1" y="0" width="1" height="1" fill="#${col2}"/>\n\t<rect x="0" y="1" width="1" height="1" fill="#${col3}"/>\n\t<rect x="1" y="1" width="1" height="1" fill="#${col4}"/>\n</svg>`
    res.setHeader("Content-Type", "image/svg+xml");
  
    res.status(200).send(battenberg_svg)
  }
  catch(e:any){
    res.setHeader("Content-Type", "text");
    res.status(400).send(e.message);
  }
}