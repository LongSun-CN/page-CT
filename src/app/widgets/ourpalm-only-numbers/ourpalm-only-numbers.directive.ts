import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[ourpalmOnlyNumbers]'
})
// onlyNumber 为真  说明 只需要输入正整数
export class OurpalmOnlyNumbersDirective {
    // 非数字正则
    DIGITS_REGEXP = new RegExp(/\D/g);

  constructor(private el:ElementRef) {
      this.el.nativeElement.onpaste = (e:any) => {
          e.preventDefault();
          let text;
          let clp = (e.originalEvent || e).clipboardData;
          if (clp === undefined || clp === null) {
              text = (<any>window).clipboardData.getData('text') || '';
              if (text !== '') {
                  text = text.replace(this.DIGITS_REGEXP, '');
                  if (window.getSelection) {
                      let newNode = document.createElement('span');
                      newNode.innerHTML = text;
                      window.getSelection().getRangeAt(0).insertNode(newNode);
                  } else {
                      (<any>window).selection.createRange().pasteHTML(text);
                  }
              }
          } else {
              text = clp.getData('text/plain') || '';
              if (text !== '') {
                  text = text.replace(this.DIGITS_REGEXP, '');
                  document.execCommand('insertText', false, text);
              }
          }
      };
  }
  // 键盘事件
  @HostListener('keydown',['$event'])
  onKeyDown(event){
    let e = <KeyboardEvent>event;
      if([46,8,9,27,13].indexOf(e.keyCode) !== -1 ||
          //    允许 ctrl+ a 全选
          (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
          //    允许 ctrl+ c 复制
          (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
          //    允许 ctrl+ v 粘贴
          (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
          //    允许 ctrl+ x 剪切
          (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
          //    允许 home end  left  right 移动光标
          (e.keyCode >= 35 && e.keyCode <=39)){
        return
      }
      // 如果不是数字键 则阻止
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
  }
  @HostListener('input',['$event'])
    onInput(event:Event){
        this.el.nativeElement.value = (<HTMLInputElement>event.currentTarget).value.replace(/\D/g,'')
  }
}
