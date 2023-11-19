export default function CopyToClipBoard(event: React.MouseEvent) {
    let p = event.currentTarget as HTMLParagraphElement 
    let value = p.innerText
    navigator.clipboard.writeText(value)
      .then(() => {
        p.innerText = "Copied to ClipBoard!"
        setTimeout(()=>{
            p.innerText = value
        }, 700)
      })
      .catch(err => {
        console.error('Error', err);
      });
}
