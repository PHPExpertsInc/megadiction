<?php

class ListManager
{
	protected function ensureListExists($name)
	{
		if (!file_exists(
	}

	public function loadList($name)
	{
		$this->ensureListExists($name);
	}
}

