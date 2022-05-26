import m from 'mithril';
import PrintR from 'PrintR';


class MyCounterComponent {

	public count : number = 0;

	view(vnode){
		return (
			<div class="border m-2">
				<div>
					count : <code>{ PrintR(this.count) }</code>
				</div>
				<button
					class="btn btn-sm btn-primary m-2"
					onclick={ ()=>{ this.count++; } }
				>this.count++</button>
			</div>
		);
	}
}


export default class SELF {

	public component_dynamically : any;
	
	oninit(){
		
		this.component_dynamically = new MyCounterComponent();
		this.component_dynamically.count = 200;
	}
	
	view(){

		return (
			<main class="container">
			
				<div class="border m-2">
					<code>
						&#123; this.component_ref = ( &lt;MyCounterComponent count=&#123;100&#125; /&gt; ) &#125;
					</code>
					{ this.component_ref = ( <MyCounterComponent count={100} /> ) }
					<button
						class="btn btn-sm btn-primary m-2"
						onclick={ ()=>{ this.component_ref.state.count++; } }
					>this.component_ref.state.count++</button>
				</div>
				<div class="border m-2">
					<code>
						&#123; m( this.component_dynamically ) &#125;
					</code>
					{ m( this.component_dynamically ) }
					<button
						class="btn btn-sm btn-primary m-2"
						onclick={ ()=>{ this.component_dynamically.count++; } }
					>this.component_dynamically.count++</button>
				</div>

			</main>
		);

	}

}

