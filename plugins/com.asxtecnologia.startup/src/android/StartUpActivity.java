package com.asxtecnologia.startup;

import android.os.Bundle;
import android.text.method.MovementMethod;
import android.app.Service;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import org.apache.cordova.*;
public class StartUpActivity extends CordovaActivity 
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
    	super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);	
    }
	
	@Override
	protected void onResume() {
		super.onResume();
	}
	
}